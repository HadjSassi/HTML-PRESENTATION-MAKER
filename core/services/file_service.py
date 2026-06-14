import json
import os
from typing import Optional

from models.schemas import Presentation

HPM_EXT = ".hpm"


class FileService:
    @staticmethod
    def save(path: str, presentation: Presentation) -> str:
        if not path.endswith(HPM_EXT):
            path += HPM_EXT
        abs_path = os.path.abspath(path)
        os.makedirs(os.path.dirname(abs_path) or ".", exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            json.dump(presentation.model_dump(), f, indent=2, ensure_ascii=False)
        return abs_path

    @staticmethod
    def load(path: str) -> Optional[Presentation]:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return Presentation(**data)

    @staticmethod
    def to_bytes(presentation: Presentation) -> bytes:
        return json.dumps(
            presentation.model_dump(), indent=2, ensure_ascii=False
        ).encode("utf-8")

    @staticmethod
    def from_bytes(data: bytes) -> Presentation:
        return Presentation(**json.loads(data.decode("utf-8")))
