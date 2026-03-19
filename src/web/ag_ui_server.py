from starlette.middleware.cors import CORSMiddleware
from src.agents.chatbot import chatbot_agent

# Use the built-in to_ag_ui method which handles protocol details
app = chatbot_agent.to_ag_ui()

# Re-apply CORS middleware to the generated app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    import logging
    logging.basicConfig(level=logging.INFO)
    uvicorn.run(app, host="0.0.0.0", port=8000)
