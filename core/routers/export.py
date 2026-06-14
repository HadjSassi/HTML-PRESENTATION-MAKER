from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from models.schemas import Presentation
from services.export_service import ExportService

router = APIRouter(prefix="/api/export", tags=["export"])


@router.post("/html")
async def export_html(presentation: Presentation):
    try:
        html = ExportService.generate_html(presentation)
        return Response(
            content=html,
            media_type="text/html",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{presentation.title}.html"'
                )
            },
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
