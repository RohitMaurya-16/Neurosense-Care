import argparse
import json
from pathlib import Path
import pickle
import pandas as pd

ROOT = Path(__file__).resolve().parent
MODELS_DIR = ROOT / "models"


def load_model(model_name):
    file_map = {"diabetes": "diabetes.pkl", "heart": "heart.pkl", "liver": "liver.pkl"}
    model_file = file_map[model_name]
    with (MODELS_DIR / model_file).open("rb") as file:
        return pickle.load(file)


def predict(model_name, input_payload):
    payload = load_model(model_name)
    features = payload["features"]
    frame = pd.DataFrame([[input_payload[col] for col in features]], columns=features)
    pred = int(payload["pipeline"].predict(frame)[0])
    proba = float(payload["pipeline"].predict_proba(frame)[0][1])
    return {"prediction": pred, "label": "Risk" if pred == 1 else "Healthy", "probability": proba}


def main():
    parser = argparse.ArgumentParser(description="Run local prediction from trained model.")
    parser.add_argument("--model", choices=["diabetes", "heart", "liver"], required=True)
    parser.add_argument("--input", required=True, help="JSON object string with full feature payload")
    args = parser.parse_args()

    data = json.loads(args.input)
    result = predict(args.model, data)
    print(result)


if __name__ == "__main__":
    main()
