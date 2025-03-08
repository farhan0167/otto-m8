from pydantic import BaseModel
from fastapi import HTTPException, APIRouter, WebSocket, WebSocketDisconnect
from extensions.experimental import Terminal

router = APIRouter()

@router.websocket("/terminal")
async def websocket_endpoint(websocket: WebSocket):
    terminal = Terminal()
    await websocket.accept()
    print("✅ WebSocket connection accepted")
    try:
        while True:
            data = await websocket.receive_text()
            response = terminal.run_command(data)
            await websocket.send_text(response)  # Async sending
    except WebSocketDisconnect:
        print("❌ Client disconnected", flush=True)
    except Exception as e:
        print(f"❌ WebSocket Error: {e}", flush=True)
    # finally:
    #     await websocket.close()
    #     print("❌ WebSocket Closed", flush=True)


