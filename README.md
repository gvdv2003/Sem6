# Hybride Wereld

An interactive historical experience featuring iconic Dutch historical figures, powered by Pydantic AI and served via a React frontend with a historical and 3D map.

## Features

- **Historical Personas**: Converse with figures like Piet Hein (1577-1629) or Witte de WithWitte Corneliszoon de With (1599–1658). Agents respond in character, adhering to their era's knowledge, vocabulary, and convictions.
- **Triage System**: Automated classification of user input to ensure accurate routing and context injection before interacting with historical characters.
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
| Xiaomi mimo-v2-flash | Triage classification |
| DeepSeek V3.2 | Character interaction |

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
│   │   ├── triage.py       # Triage & classification agent
│   │   └── ...
│   ├── personas/           # Historical character definitions
│   │   ├── base.py         # Persona loading logic
│   │   ├── piet_hein/      # Piet Hein config & prompts
│   │   └── witte_de_with/  # Witte de With config & prompts
│   ├── core/
│   │   └── llm.py          # LLM provider factory
│   └── web/
│       └── ag_ui_server.py # FastAPI server with AG-UI adapter
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── pages/          # Route-level page components
│   │   ├── components/     # Reusable UI components
│   │   └── router.tsx      # Application routes
│   └── ...
├── docs/                   # Project documentation & justifications
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
| `OPENROUTER_MODEL` | Default model for persona interaction (e.g., `deepseek/deepseek-v3.2`) |

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