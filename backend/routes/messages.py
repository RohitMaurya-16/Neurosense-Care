from flask import Blueprint, jsonify, request
from utils.file_handler import read_json, write_json

messages_bp = Blueprint("messages", __name__)


@messages_bp.get("/messages")
def get_messages():
    patient_id = request.args.get("patient_id")
    doctor_id = request.args.get("doctor_id")
    rows = read_json("messages.json")
    if patient_id:
        rows = [r for r in rows if str(r.get("patient_id")) == str(patient_id)]
    if doctor_id:
        rows = [r for r in rows if str(r.get("doctor_id")) == str(doctor_id)]
    rows = sorted(rows, key=lambda r: r.get("timestamp", ""))
    return jsonify(rows)


@messages_bp.post("/messages")
def create_message():
    payload = request.get_json(force=True)
    rows = read_json("messages.json")
    payload["id"] = len(rows) + 1
    rows.append(payload)
    write_json("messages.json", rows)
    return jsonify(payload), 201
