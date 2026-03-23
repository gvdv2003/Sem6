# Hybride Wereld

An interactive historical experience featuring Piet Hein, a 17th-century Dutch admiral, powered by Pydantic AI and served via a React frontend with a historical and 3D map.

## Features

- **Piet Hein Persona**: Converse with Piet Hein (1577-1629), Admiral of the West India Company (WIC). The agent responds in character, using Dutch and refusing to acknowledge technology beyond 1629.
- **AG-UI Protocol**: Real-time streaming communication between the React frontend and the Pydantic AI backend over the [AG-UI](https://ai.pydantic.dev/ui/ag-ui) protocol.
- **Historical Map Interface**: A Cesium-powered 3D map as the main entry point of the application.
- **Switchable LLM Providers**: Use OpenRouter (cloud) or a local LLM via a configurable environment variable.

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Python 3.12+ | Language |
| [Pydantic AI](https://ai.pydantic.dev/) | Agent framework |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |
| OpenRouter / Local LLM | LLM inference |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite + Bun | Build tooling |
| [CesiumJS](https://cesium.com/platform/cesiumjs/) | 3D geospatial map |
| React Router | Client-side routing |
| Tailwind CSS | Styling |

## Project Structure

```
hybride-wereld-repo/
├── src/                    # Python backend
│   ├── agents/
│   │   └── chatbot.py      # Piet Hein agent definition
│   ├── core/
│   │   └── llm.py          # LLM provider factory
│   └── web/
│       └── ag_ui_server.py # AG-UI ASGI server
├── frontend/               # React frontend (Vite)
│   └── src/
│       ├── pages/          # Route-level page components
│       ├── components/     # Reusable UI components
│       └── router.tsx      # Application routes
├── docs/                   # Project documentation
├── .env.example            # Environment variable template
├── pyproject.toml          # Python project configuration
└── run_dev.ps1             # Development startup script
```

## Getting Started

### Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [Bun](https://bun.sh/) (JavaScript runtime & package manager)

### 1. Clone and install dependencies

```powershell
# Install Python dependencies
uv sync

# Install frontend dependencies
cd frontend
bun install
cd ..
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```powershell
Copy-Item .env.example .env
```

| Variable | Description |
|---|---|
| `MODEL_PROVIDER` | `openrouter` or `local` |
| `OPENROUTER_API_KEY` | Your [OpenRouter](https://openrouter.ai/) API key |
| `OPENAI_API_KEY` | Your OpenAI API key (used for embeddings) |
| `OPENAI_BASE_URL` | Base URL for local LLM (only when `MODEL_PROVIDER=local`) |

### 3. Run the development environment

```powershell
.\run_dev.ps1
```

This starts:
- The AG-UI backend on `http://localhost:8000`
- The React frontend on `http://localhost:5173`

## Routes

| Path | Description |
|---|---|
| `/map` | Historical map (default view) |
| `/characters/piet-hein` | Chat interface with Piet Hein |