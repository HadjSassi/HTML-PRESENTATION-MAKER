from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class RealtimeHub:
    def __init__(self) -> None:
        self._clients: set[WebSocket] = set()
        self._lock = asyncio.Lock()
        self._active_slide: dict[str, Any] | None = None
        self._notes: list[dict[str, Any]] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._clients.add(websocket)
            snapshot = self._snapshot_locked()
        await websocket.send_json({"type": "state:init", **snapshot})

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._clients.discard(websocket)

    async def handle_message(self, websocket: WebSocket, message: dict[str, Any]) -> None:
        message_type = message.get("type")
        if message_type == "slideChanged":
            slide = self._normalize_slide(message)
            async with self._lock:
                self._active_slide = slide
            await self._broadcast({"type": "slideChanged", "slide": slide})
            return

        if message_type == "note:submit":
            text = str(message.get("text", "")).strip()
            if not text:
                await websocket.send_json(
                    {"type": "error", "message": "Note text is required"}
                )
                return

            async with self._lock:
                slide = self._active_slide or self._normalize_slide(message)
                note = self._build_note(text, slide)
                self._notes.append(note)
                self._notes = self._notes[-100:]
            await self._broadcast({"type": "noteAdded", "note": note})
            return

        await websocket.send_json(
            {"type": "error", "message": f"Unsupported message type: {message_type}"}
        )

    def snapshot(self) -> dict[str, Any]:
        return self._snapshot_locked()

    def _snapshot_locked(self) -> dict[str, Any]:
        return {
            "activeSlide": self._active_slide,
            "notes": list(self._notes),
        }

    def _normalize_slide(self, message: dict[str, Any]) -> dict[str, Any]:
        slide_index = int(message.get("slideIndex", 0))
        slide_number = int(message.get("slideNumber", slide_index + 1))
        return {
            "slideId": str(message.get("slideId", "")),
            "slideIndex": slide_index,
            "slideNumber": slide_number,
            "slideName": str(message.get("slideName", "")),
            "presentationTitle": str(message.get("presentationTitle", "")),
        }

    def _build_note(self, text: str, slide: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": str(uuid4()),
            "text": text,
            "createdAt": _now(),
            "slideId": slide.get("slideId", ""),
            "slideIndex": slide.get("slideIndex", 0),
            "slideNumber": slide.get("slideNumber", 1),
            "slideName": slide.get("slideName", ""),
            "presentationTitle": slide.get("presentationTitle", ""),
        }

    async def _broadcast(self, payload: dict[str, Any]) -> None:
        async with self._lock:
            clients = list(self._clients)

        dead_clients: list[WebSocket] = []
        for client in clients:
            try:
                await client.send_json(payload)
            except (RuntimeError, WebSocketDisconnect):
                dead_clients.append(client)

        if dead_clients:
            async with self._lock:
                for client in dead_clients:
                    self._clients.discard(client)


realtime_hub = RealtimeHub()
