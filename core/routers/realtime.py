from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.realtime_service import realtime_hub

router = APIRouter(tags=["realtime"])


@router.websocket("/ws/realtime")
async def realtime_socket(websocket: WebSocket):
    await realtime_hub.connect(websocket)
    try:
        while True:
            message = await websocket.receive_json()
            await realtime_hub.handle_message(websocket, message)
    except WebSocketDisconnect:
        await realtime_hub.disconnect(websocket)


@router.get("/api/realtime/state")
async def realtime_state():
    return {"success": True, **realtime_hub.snapshot()}
