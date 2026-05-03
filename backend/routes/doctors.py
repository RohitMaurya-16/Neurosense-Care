from flask import Blueprint, jsonify, request
from utils.file_handler import read_json
from utils.file_handler import write_json

doctors_bp = Blueprint("doctors", __name__)


@doctors_bp.get("/doctors")
def get_doctors():
    rows = read_json("doctors.json")
    return jsonify([{k: v for k, v in row.items() if k != "password"} for row in rows])


@doctors_bp.get("/doctors/<doctor_id>")
def get_doctor(doctor_id):
    rows = read_json("doctors.json")
    row = next((r for r in rows if str(r.get("id")) == str(doctor_id)), None)
    if row is None:
        return jsonify({"error": "Doctor not found"}), 404
    return jsonify({k: v for k, v in row.items() if k != "password"})


@doctors_bp.put("/doctors/<doctor_id>")
def update_doctor(doctor_id):
    payload = request.get_json(force=True)
    rows = read_json("doctors.json")
    index = next((i for i, r in enumerate(rows) if str(r.get("id")) == str(doctor_id)), None)
    if index is None:
        return jsonify({"error": "Doctor not found"}), 404
    current = rows[index]
    protected = {"id", "email", "password"}
    for key, value in payload.items():
        if key not in protected:
            current[key] = value
    rows[index] = current
    write_json("doctors.json", rows)
    return jsonify({k: v for k, v in current.items() if k != "password"})
