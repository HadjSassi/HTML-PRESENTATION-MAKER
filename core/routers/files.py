from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from models.schemas import LoadRequest, SaveRequest
from services.file_service import FileService

router = APIRouter(prefix="/api/files", tags=["files"])


@router.post("/save")
async def save_presentation(req: SaveRequest):
    try:
        saved_path = FileService.save(req.path, req.presentation)
        return {"success": True, "path": saved_path}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/load")
async def load_presentation(req: LoadRequest):
    try:
        presentation = FileService.load(req.path)
        return {"success": True, "presentation": presentation.model_dump()}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found: {req.path}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/health")
async def health():
    return {"status": "ok"}
