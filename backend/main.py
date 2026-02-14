from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
import asyncio
from agent import ReActAgent, AgentLogger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

class WebSocketLogger(AgentLogger):
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket

    async def log(self, message: str, type: str = "info"):
        data = {
            "type": type,
            "content": message
        }
        await self.websocket.send_json(data)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    logger = WebSocketLogger(websocket)
    agent = ReActAgent(logger)
    
    try:
        while True:
            data = await websocket.receive_text()
            # The client sends a simple string or JSON with a query
            # For simplicity, assume raw text is the query
            query = data
            
            await logger.log(f"Received query: {query}", type="user_query")
            
            # Run the agent
            try:
                # We run this in a thread or just await if async supported
                # ReActAgent.run is async now
                final_answer = await agent.run(query)
                await logger.log(final_answer, type="final_answer")
            except Exception as e:
                await logger.log(f"Error executing agent: {str(e)}", type="error")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
