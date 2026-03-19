# Run AG-UI Backend (in a new window, keeping project root as CWD)
$projectRoot = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "cd '$projectRoot'; uv run python -m uvicorn src.web.ag_ui_server:app --reload --port 8000"

# Run React Frontend
Set-Location "$projectRoot\frontend"
bun --bun run dev
