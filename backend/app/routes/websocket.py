from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.broadcast import broadcast
from websockets.exceptions import ConnectionClosed

router = APIRouter()

@router.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str):
    await websocket.accept()
    try:
        async with broadcast.subscribe(channel=room) as subscriber:
            async for event in subscriber:
                try:
                    if websocket.client_state.name == "CONNECTED":
                        await websocket.send_text(event.message)
                    else:
                        break
                except (ConnectionClosed, WebSocketDisconnect, RuntimeError):
                    break
    except (ConnectionClosed, WebSocketDisconnect, RuntimeError):
        pass