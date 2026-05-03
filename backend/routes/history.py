from flask import Blueprint, jsonify, request
from utils.file_handler import read_json, write_json

history_bp = Blueprint("history", __name__)


@history_bp.get("/history/<patient_id>")
def get_history(patient_id):
    rows = read_json("history.json")
    return jsonify([row for row in rows if str(row["patient_id"]) == str(patient_id)])


@history_bp.post("/history")
def create_history():
    payload = request.get_json(force=True)
    rows = read_json("history.json")
    payload["id"] = len(rows) + 1
    rows.append(payload)
    write_json("history.json", rows)
    return jsonify(payload), 201
