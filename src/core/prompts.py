# ============================================================================
# prompts.py - Centralized prompt management
# ============================================================================

class PromptConfig:
    """Manages system prompts and guardrails for the agent."""
    
    # Triage system prompt for classification
    TRIAGE_PROMPT = """
You are a generic triage classifier.

Classify the user input STRICTLY into TriageStatus JSON:

- topic: A short string estimating the main topic of the user's message.
- language: Detected primary language code (e.g., 'en', 'nl').
- reasoning: 1-2 sentences explaining reasoning.

User message: {input}
Respond ONLY with valid TriageStatus JSON.
"""

    @classmethod
    def get_triage_prompt(cls) -> str:
        """Returns the triage classification prompt."""
        return cls.TRIAGE_PROMPT.strip()
