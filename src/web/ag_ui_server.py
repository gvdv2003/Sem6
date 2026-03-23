import logging
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException
from starlette.responses import Response, JSONResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic_ai.ui.ag_ui import AGUIAdapter

from src.personas import get_persona, list_personas
from src.agents.triage import triage_agent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Re-apply CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/personas", response_class=JSONResponse)
async def get_all_personas():
    """Return a list of all available personas with their metadata."""
    personas = list_personas()
    return [
        {
            "slug": p.slug,
            "display_name": p.display_name,
            "description": p.description,
            "avatar": p.avatar,
            "predefined_prompts": p.predefined_prompts
        }
        for p in personas
    ]

@app.get("/personas/{persona_slug}", response_class=JSONResponse)
async def get_persona_metadata(persona_slug: str):
    """Return metadata for a specific persona."""
    try:
        p = get_persona(persona_slug)
        return {
            "slug": p.slug,
            "display_name": p.display_name,
            "description": p.description,
            "avatar": p.avatar,
            "predefined_prompts": p.predefined_prompts
        }
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_slug}' not found")

@app.post("/{persona_slug}")
async def run_agent(persona_slug: str, request: Request) -> Response:
    try:
        persona_config = get_persona(persona_slug)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_slug}' not found")
        
    body = await request.json()
    
    # Extract the last user message
    last_user_message = ""
    messages = body.get("messages", [])
    
    for msg in reversed(messages):
        if msg.get("role") == "user":
            parts = msg.get("parts", [])
            for part in parts:
                if part.get("part_kind") == "text":
                    last_user_message = part.get("content", "")
            if last_user_message:
                break
            # Fallback if content is directly on the message
            if not last_user_message and "content" in msg:
                last_user_message = msg["content"]
                break
            
    if last_user_message:
        logger.info(f"Running triage on message: {last_user_message}")
        try:
            # Run triage agent synchronously
            triage_result = await triage_agent.run(last_user_message)
            classification = triage_result.output
            
            logger.info(f"Triage Result - Topic: {classification.topic}, Language: {classification.language}, Reasoning: {classification.reasoning}")
                
        except Exception as e:
            logger.error(f"Error during triage: {e}")

    # Dispatch to the specific persona's agent
    return await AGUIAdapter.dispatch_request(request, agent=persona_config.agent)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
