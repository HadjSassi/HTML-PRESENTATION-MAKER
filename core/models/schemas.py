from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4


class Animation(BaseModel):
    type: str = "fade"
    duration: float = 0.6


class Slide(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = "New Slide"
    background_color: str = "#FFFFFF"
    canvas_json: str = "{}"
    animation: Animation = Field(default_factory=Animation)
    thumbnail: Optional[str] = None


class Presentation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = "My Presentation"
    author: str = ""
    save_path: str = ""
    slides: List[Slide] = Field(default_factory=list)
    version: str = "1.0"
    created_at: str = ""
    updated_at: str = ""


class SaveRequest(BaseModel):
    path: str
    presentation: Presentation


class LoadRequest(BaseModel):
    path: str

