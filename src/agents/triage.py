from pydantic import BaseModel, Field
from src.core.llm import get_triage_model
from src.core.prompts import PromptConfig
from pydantic_ai import Agent

class TriageStatus(BaseModel):
    """
    Structured generic triage classification for user input.
    """
    topic: str = Field(
        ...,
        description="The main topic or subject of the user's request."
    )
    language: str = Field(
        ...,
        description="Detected primary language code (e.g., 'en', 'nl')."
    )
    reasoning: str = Field(
        ...,
        description="Brief explanation of classification."
    )

# Triage agent for classification
triage_agent = Agent(
    model=get_triage_model(),
    output_type=TriageStatus,
    system_prompt=PromptConfig.get_triage_prompt(),
)
