import os
import json
import re
import asyncio
from typing import List, Dict, Any, Optional
from openai import OpenAI
from tools import get_tools

class AgentLogger:
    async def log(self, message: str, type: str = "info"):
        """Abstract method to be implemented by the caller"""
        raise NotImplementedError

class ReActAgent:
    def __init__(self, logger: AgentLogger):
        # We assume the API key is in env, if not, we might fail or need a mock.
        # Ideally we would use a more robust config system.
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
             # Basic check to avoid immediate crash if env not set
             print("Warning: OPENAI_API_KEY not found in environment variables.")
        self.client = OpenAI(api_key=api_key)
        self.tools = {t.name: t for t in get_tools()}
        self.logger = logger
        self.max_steps = 15

    def _get_system_prompt(self) -> str:
        tool_desc = "\n".join([f"{t.name}: {t.description}" for t in self.tools.values()])
        return f"""
You are a smart assistant designed to help answer questions about a user's CV.
You have access to the following tools:

{tool_desc}

To use a tool, please use the following format:

Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of [{', '.join(self.tools.keys())}]
Action Input: the input to the action
Observation: the result of the action

When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:

Thought: Do I need to use a tool? No
Final Answer: [your response here]

Begin!
"""

    async def run(self, query: str):
        prompt = self._get_system_prompt()
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query}
        ]
        
        step = 0
        while step < self.max_steps:
            step += 1
            await self.logger.log(f"Step {step}: Thinking...", type="step_start")
            
            try:
                # We need to run the sync OpenAI call in a way that doesn't block the async loop
                # This is crucial for WebSocket heartbeats if any
                loop = asyncio.get_event_loop()
                completion = await loop.run_in_executor(
                    None, 
                    lambda: self.client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=messages,
                        stop=["Observation:"],
                        temperature=0
                    )
                )
                
                response_text = completion.choices[0].message.content
                
                # Check for Final Answer
                if "Final Answer:" in response_text:
                    parts = response_text.split("Final Answer:")
                    thought_part = parts[0].strip()
                    final_answer = parts[1].strip()
                    
                    if thought_part:
                        # Log thought without the final answer
                        await self.logger.log(thought_part, type="thought")
                    
                    # We return the final answer. The main.py will log it as type="final_answer"
                    return final_answer

                # If no final answer, log the whole thought (which might include Action)
                await self.logger.log(response_text, type="thought")
                
                # Append assistant thought to history
                messages.append({"role": "assistant", "content": response_text})


                # Check for Action
                # Regex to handle potential newlines or spacing issues
                action_match = re.search(r"Action:\s*(.*?)[\n\r]+Action Input:\s*(.*)", response_text, re.DOTALL)
                
                if action_match:
                    action_name = action_match.group(1).strip()
                    action_input = action_match.group(2).strip()
                    
                    await self.logger.log(f"Calling tool: {action_name} with input: {action_input}", type="action_call")
                    
                    if action_name in self.tools:
                        # Execute tool
                        tool = self.tools[action_name]
                        # Run tool execution in executor as well if it's IO bound (file reading is fast but good practice)
                        tool_output = await loop.run_in_executor(None, lambda: tool.execute(action_input))
                    else:
                        tool_output = f"Error: Tool '{action_name}' not found. Please use one of {list(self.tools.keys())}."
                    
                    await self.logger.log(f"Tool output: {tool_output[:200]}...", type="observation")
                    
                    # Append observation to history as User message (or System, but User is standard for ReAct in Chat)
                    messages.append({"role": "user", "content": f"Observation: {tool_output}"})
                else:
                    # If the model didn't output an action or final answer, we might prompt it to continue
                    if "Thought:" not in response_text:
                        # If it just chatted, treat it as final answer? Or force format.
                         messages.append({"role": "user", "content": "Please continue with the format 'Thought:', 'Action:', 'Action Input:', or 'Final Answer:'."})
                    else:
                         # It might have stopped at Observation: but we handle that via stop token. 
                         # If it stopped elsewhere, just let it continue.
                         pass

            except Exception as e:
                error_msg = f"Error in agent step: {str(e)}"
                await self.logger.log(error_msg, type="error")
                return "I encountered an error."
                
        return "Max steps reached."
