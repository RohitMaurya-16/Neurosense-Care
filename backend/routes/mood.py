from flask import Blueprint, jsonify, request
from utils.file_handler import read_json, write_json

mood_bp = Blueprint("mood", __name__)


@mood_bp.post("/mood")
def create_mood():
    payload = request.get_json(force=True)
    rows = read_json("mood.json")
    existing_index = next(
        (
            i
            for i, row in enumerate(rows)
            if str(row.get("patient_id")) == str(payload.get("patient_id")) and str(row.get("date")) == str(payload.get("date"))
        ),
        None,
    )
    if existing_index is not None:
        payload["id"] = rows[existing_index]["id"]
        rows[existing_index] = payload
    else:
        payload["id"] = len(rows) + 1
        rows.append(payload)
    write_json("mood.json", rows)
    return jsonify(payload), 201


@mood_bp.get("/mood/<patient_id>")
def get_mood(patient_id):
    rows = read_json("mood.json")
    return jsonify([row for row in rows if str(row["patient_id"]) == str(patient_id)])
