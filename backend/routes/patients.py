from flask import Blueprint, jsonify, request
from utils.file_handler import read_json, write_json

patients_bp = Blueprint("patients", __name__)


@patients_bp.get("/patients")
def get_patients():
    rows = read_json("users.json")
    return jsonify([{k: v for k, v in row.items() if k != "password"} for row in rows])


@patients_bp.get("/patients/<patient_id>")
def get_patient(patient_id):
    rows = read_json("users.json")
    row = next((r for r in rows if str(r.get("id")) == str(patient_id)), None)
    if row is None:
        return jsonify({"error": "Patient not found"}), 404
    return jsonify({k: v for k, v in row.items() if k != "password"})


@patients_bp.put("/patients/<patient_id>")
def update_patient(patient_id):
    payload = request.get_json(force=True)
    rows = read_json("users.json")
    index = next((i for i, r in enumerate(rows) if str(r.get("id")) == str(patient_id)), None)
    if index is None:
        return jsonify({"error": "Patient not found"}), 404
    current = rows[index]
    protected = {"id", "email", "password"}
    for key, value in payload.items():
        if key not in protected:
            current[key] = value
    rows[index] = current
    write_json("users.json", rows)
    return jsonify({k: v for k, v in current.items() if k != "password"})
