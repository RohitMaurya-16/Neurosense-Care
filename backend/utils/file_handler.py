import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def _path(name: str) -> Path:
    path = DATA_DIR / name
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("[]", encoding="utf-8")
    return path


def read_json(name: str):
    with _path(name).open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(name: str, data):
    with _path(name).open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
