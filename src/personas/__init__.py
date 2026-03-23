import logging
from pathlib import Path
from typing import Dict

from src.personas.base import PersonaConfig, load_persona

logger = logging.getLogger(__name__)

# The directory containing persona folders
PERSONAS_DIR = Path(__file__).parent

_PERSONAS: Dict[str, PersonaConfig] = {}

def _init_registry():
    """Discover and load all personas in the personas directory."""
    if _PERSONAS:
        return
        
    logger.info(f"Discovering personas in {PERSONAS_DIR}")
    for item in PERSONAS_DIR.iterdir():
        if item.is_dir() and item.name != "__pycache__":
            # Ensure it has the required files
            if (item / "system_prompt.md").exists() and (item / "avatar.json").exists():
                logger.info(f"Loading persona: {item.name}")
                try:
                    config = load_persona(item)
                    _PERSONAS[item.name] = config
                except Exception as e:
                    logger.error(f"Failed to load persona {item.name}: {e}")

# Initialize registry on module import
_init_registry()

def get_persona(slug: str) -> PersonaConfig:
    """Get a persona by its slug."""
    if slug not in _PERSONAS:
        raise KeyError(f"Persona '{slug}' not found.")
    return _PERSONAS[slug]

def list_personas() -> list[PersonaConfig]:
    """List all available personas."""
    return list(_PERSONAS.values())
