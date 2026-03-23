import json
from typing import Any
from pathlib import Path
from pydantic import BaseModel, ConfigDict
from pydantic_ai import Agent
from src.core.llm import get_model

class PersonaConfig(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    slug: str
    display_name: str
    description: str
    system_prompt: str
    predefined_prompts: list[str]
    avatar: dict
    agent: Any

def load_persona(persona_dir: Path) -> PersonaConfig:
    slug = persona_dir.name
    
    with open(persona_dir / "system_prompt.md", "r", encoding="utf-8") as f:
        system_prompt = f.read().strip()
        print(f"DEBUG: Loaded system prompt for {slug}: {system_prompt[:50]}...")
        
    with open(persona_dir / "predefined.json", "r", encoding="utf-8") as f:
        predefined_prompts = json.load(f)
        
    with open(persona_dir / "avatar.json", "r", encoding="utf-8") as f:
        avatar = json.load(f)
        
    display_name = avatar.get("display_name", slug)
    description = avatar.get("description", "")
        
    agent = Agent(
        model=get_model(),
        instructions=system_prompt,
    )
    
    return PersonaConfig(
        slug=slug,
        display_name=display_name,
        description=description,
        system_prompt=system_prompt,
        predefined_prompts=predefined_prompts,
        avatar=avatar,
        agent=agent,
    )
