# Triage Agent Integration Plan

The goal is to implement a triage agent that runs after every user interaction and before every AI response in the AG-UI framework.

## Proposed Changes

### [Agents]

#### [NEW] `src/agents/triage.py`
Restore the `triage_agent` from the `src_backup/agents/triage.py` backup. This agent classifies user input into topics and detects emergencies or sensitive content.

### [Web Server]

#### [MODIFY] `src/web/ag_ui_server.py`
Update the server to intercept incoming requests:
1. Initialize a generic `FastAPI` (or Starlette) app instead of using `.to_ag_ui()`.
2. Define a POST route at `/`.
3. In the route handler:
    - Parse the incoming `RunAgentInput`.
    - Run `triage_agent.run(last_message)`.
    - Based on the result, either:
        - Inject a system prompt/disclaimer into the session context.
        - Proceed to run the `chatbot_agent` via Pydantic AI's `handle_ag_ui_request` or `AGUIAdapter.dispatch_request()`.

## Sources

- [Pydantic AI AG-UI Documentation](https://ai.pydantic.dev/ui/ag-ui)
- [Pydantic AI API Reference: handle_ag_ui_request](https://ai.pydantic.dev/api/ag_ui)
- [Pydantic AI API Reference: dispatch_request](https://ai.pydantic.dev/api/ui/base)

---

## Verification Plan

### Automated Tests
- No existing automated tests were found for the web server. We will rely on manual verification via the browser.

### Manual Verification
1. Start the server using `python -m src.web.ag_ui_server`.
2. Open the AG-UI frontend (at `http://localhost:5173`).
3. Send a message that triggers a specific triage category (e.g., "I need a place to sleep" for 'shelter').
4. Verify in the server logs that the triage agent ran and correctly classified the message.
5. Send an "emergency" message (e.g., "I have severe chest pain") and verify that a disclaimer is shown.
