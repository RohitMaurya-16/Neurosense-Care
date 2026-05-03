from pathlib import Path
import pickle
import pandas as pd
from flask import Blueprint, jsonify, request

predict_bp = Blueprint("predict", __name__)

MODEL_DIR = Path(__file__).resolve().parents[2] / "ml-model" / "models"
MODEL_FILES = {"diabetes": "diabetes.pkl", "heart": "heart.pkl", "liver": "liver.pkl"}


def _run_prediction(model_name: str, payload: dict):
    model_path = MODEL_DIR / MODEL_FILES[model_name]
    if not model_path.exists():
        return None, {"error": f"Model file not found: {model_path.name}. Run ml-model/train.py first."}, 400

    with model_path.open("rb") as file:
        model_payload = pickle.load(file)

    features = model_payload["features"]
    missing = [feature for feature in features if feature not in payload]
    if missing:
        return None, {"error": "Missing required fields", "missing_fields": missing}, 400

    frame = pd.DataFrame([[payload[f] for f in features]], columns=features)
    prediction = int(model_payload["pipeline"].predict(frame)[0])
    probability = float(model_payload["pipeline"].predict_proba(frame)[0][1])
    result = {
        "model": model_name,
        "prediction": prediction,
        "label": "Risk" if prediction == 1 else "Healthy",
        "probability": probability,
    }
    return result, None, 200


@predict_bp.post("/predict/diabetes")
def predict_diabetes():
    payload = request.get_json(force=True)
    result, error, status = _run_prediction("diabetes", payload)
    return jsonify(result if error is None else error), status


@predict_bp.post("/predict/heart")
def predict_heart():
    payload = request.get_json(force=True)
    result, error, status = _run_prediction("heart", payload)
    return jsonify(result if error is None else error), status


@predict_bp.post("/predict/liver")
def predict_liver():
    payload = request.get_json(force=True)
    result, error, status = _run_prediction("liver", payload)
    return jsonify(result if error is None else error), status
