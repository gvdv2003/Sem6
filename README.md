# Assistant Chatbot

An AI-powered interactive chatbot using RAG (Retrieval-Augmented Generation) and Pydantic AI.

## Getting Started

1. Set up a virtual environment and use `uv sync` to install dependencies.
2. Configure `.env` using `.env.example`
3. Make sure you have a Postgres database with pgvector installed (using Supabase).
4. Run `uv run python src/main.py` for terminal mode, or `.\run_app.ps1` for the web UI via Chainlit.