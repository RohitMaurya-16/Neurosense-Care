from flask import Blueprint, jsonify, request
from utils.file_handler import read_json, write_json

appointments_bp = Blueprint("appointments", __name__)


@appointments_bp.get("/appointments")
def get_appointments():
    patient_id = request.args.get("patient_id")
    doctor_id = request.args.get("doctor_id")
    rows = read_json("appointments.json")
    if patient_id:
        rows = [r for r in rows if str(r.get("patient_id")) == str(patient_id)]
    if doctor_id:
        rows = [r for r in rows if str(r.get("doctor_id")) == str(doctor_id)]
    return jsonify(rows)


@appointments_bp.post("/appointments")
def create_appointment():
    payload = request.get_json(force=True)
    rows = read_json("appointments.json")
    payload["id"] = len(rows) + 1
    payload["status"] = payload.get("status", "Pending")
    payload["meeting_link"] = payload.get("meeting_link", f"https://meet.neurosense.local/{payload['id']}")
    rows.append(payload)
    write_json("appointments.json", rows)
    return jsonify(payload), 201


@appointments_bp.put("/appointments/<appointment_id>/status")
def update_status(appointment_id):
    payload = request.get_json(force=True)
    status = payload.get("status")
    if status not in ("Pending", "Confirmed", "Completed"):
        return jsonify({"error": "Invalid status"}), 400
    rows = read_json("appointments.json")
    index = next((i for i, r in enumerate(rows) if str(r.get("id")) == str(appointment_id)), None)
    if index is None:
        return jsonify({"error": "Appointment not found"}), 404
    rows[index]["status"] = status
    write_json("appointments.json", rows)
    return jsonify(rows[index])
