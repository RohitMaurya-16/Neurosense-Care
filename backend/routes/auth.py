from flask import Blueprint, jsonify, request
from utils.file_handler import read_json

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/auth/login")
def login():
    payload = request.get_json(force=True)
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    role = payload.get("role", "").strip().lower()

    if role not in ("patient", "doctor"):
        return jsonify({"error": "Invalid role"}), 400

    source = "users.json" if role == "patient" else "doctors.json"
    users = read_json(source)
    user = next((u for u in users if u.get("email", "").lower() == email and u.get("password") == password), None)
    if user is None:
        return jsonify({"error": "Invalid credentials"}), 401

    safe_user = {k: v for k, v in user.items() if k != "password"}
    return jsonify({"session": {"role": role, "user": safe_user}})
