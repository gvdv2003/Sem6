# Triage Agent Integration Plan

The goal is to implement a triage agent that runs after every user interaction and before every AI response in the AG-UI framework.

## Approach

Use `AGUIAdapter.dispatch_request()` (Option 2) inside an explicit FastAPI app. This replaces the current `chatbot_agent.to_ag_ui()` (Option 3) pattern, which does not support pre-dispatch interception or per-request dependency injection.

The triage agent runs first on each incoming request. Based on its classification, it optionally injects a system prompt or disclaimer before dispatching to the `chatbot_agent`.

## Proposed Changes

### [Agents]

#### [NEW] `src/agents/triage.py`
Restore the `triage_agent` from `src_backup/agents/triage.py`. This agent classifies user input into topics and detects emergencies or sensitive content.

### [Web Server]

#### [MODIFY] `src/web/ag_ui_server.py`
Replace `.to_ag_ui()` with an explicit FastAPI app using `AGUIAdapter.dispatch_request()`:

1. Replace `chatbot_agent.to_ag_ui()` with a `FastAPI()` instance.
2. Define a POST route at `/`.
3. In the route handler:
   - Parse the incoming `RunAgentInput` to extract the last user message.
   - Run `triage_agent.run(last_message)` synchronously before dispatching.
   - Based on the triage result, optionally inject a system prompt or disclaimer into the request context.
   - Dispatch to `chatbot_agent` via `AGUIAdapter.dispatch_request(request, agent=chatbot_agent)`.

```python
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import Response
from pydantic_ai.ui.ag_ui import AGUIAdapter
from src.agents.chatbot import chatbot_agent
from src.agents.triage import triage_agent

app = FastAPI()

@app.post('/')
async def run_agent(request: Request) -> Response:
    # TODO: parse body, run triage_agent, inject context
    return await AGUIAdapter.dispatch_request(request, agent=chatbot_agent)
```

## Sources

- [Pydantic AI AG-UI Documentation](https://ai.pydantic.dev/ui/ag-ui)
- [Pydantic AI API Reference: AGUIAdapter](https://ai.pydantic.dev/api/ui/base)

---

## Verification Plan

### Automated Tests
No existing automated tests were found for the web server. Manual verification will be used.

### Manual Verification
1. Start the server using `python -m src.web.ag_ui_server`.
2. Open the AG-UI frontend at `http://localhost:5173`.
3. Send a message that triggers a specific triage category (e.g., "I need a place to sleep" for 'shelter').
4. Verify in the server logs that the triage agent ran and correctly classified the message.
5. Send an "emergency" message (e.g., "I have severe chest pain") and verify that a disclaimer is shown.
