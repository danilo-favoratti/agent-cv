import os
import json
from typing import List, Dict, Any

class DataTool:
    def __init__(self, name: str, description: str, data_file: str):
        self.name = name
        self.description = description
        self.data_file = data_file
        self.data_path = os.path.join(os.path.dirname(__file__), "..", "data", data_file)

    def execute(self, query: str = "") -> str:
        try:
            with open(self.data_path, 'r') as f:
                data = json.load(f)
            # For a real "expert", we might filter based on the query, 
            # but for now we return the whole data to let the LLM filter.
            # In a production app, we would use semantic search or specific query logic here.
            return json.dumps(data, indent=2)
        except Exception as e:
            return f"Error reading data: {str(e)}"

# Define the tools
soft_skills_tool = DataTool(
    name="SoftSkillsExpert",
    description="Useful for answering questions about soft skills, interpersonal abilities, and leadership qualities.",
    data_file="soft_skills.json"
)

projects_tool = DataTool(
    name="ProjectsExpert",
    description="Useful for answering questions about past projects, technical roles, and technologies used.",
    data_file="projects.json"
)

clients_tool = DataTool(
    name="ClientsExpert",
    description="Useful for answering questions about previous clients, industries worked in, and employment duration.",
    data_file="clients.json"
)

def get_tools() -> List[DataTool]:
    return [soft_skills_tool, projects_tool, clients_tool]
