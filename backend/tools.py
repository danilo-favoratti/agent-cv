import os
import json
from typing import List, Dict, Any

class DataTool:
    def __init__(self, name: str, description: str, data_file: str):
        self.name = name
        self.description = description
        self.data_path = os.path.join(os.path.dirname(__file__), "..", "data", data_file)

    def execute(self, query: str = "") -> str:
        try:
            with open(self.data_path, 'r') as f:
                data = json.load(f)
            # Simplistic retrieval: return everything
            return json.dumps(data, indent=2)
        except Exception as e:
            return f"Error reading data: {str(e)}"

# Existing Tools
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

# New Tools
hard_skills_tool = DataTool(
    name="HardSkillsExpert",
    description="Useful for answering questions about technical skills, programming languages, frameworks, and tools.",
    data_file="hard_skills.json"
)

hobbies_tool = DataTool(
    name="HobbiesExpert",
    description="Useful for answering questions about personal interests, hobbies, and side activities.",
    data_file="hobbies.json"
)

testimonials_tool = DataTool(
    name="TestimonialsExpert",
    description="Useful for answering questions about what others say about the candidate (references, feedback).",
    data_file="testimonials.json"
)

personal_data_tool = DataTool(
    name="PersonalDataExpert",
    description="Useful for providing basic personal information like name, role, contact info, and summary.",
    data_file="personal_data.json"
)

papers_tool = DataTool(
    name="PapersExpert",
    description="Useful for answering questions about published papers, articles, or technical writings.",
    data_file="papers.json"
)

speeches_tool = DataTool(
    name="SpeechesExpert",
    description="Useful for answering questions about public speaking, conferences, and talks given.",
    data_file="speeches.json"
)

prizes_tool = DataTool(
    name="PrizesExpert",
    description="Useful for answering questions about awards, honors, and hackathon wins.",
    data_file="prizes.json"
)

def get_tools() -> List[DataTool]:
    return [
        soft_skills_tool, 
        projects_tool, 
        clients_tool,
        hard_skills_tool,
        hobbies_tool,
        testimonials_tool,
        personal_data_tool,
        papers_tool,
        speeches_tool,
        prizes_tool
    ]
