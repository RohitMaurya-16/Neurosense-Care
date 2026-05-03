from pathlib import Path
import pickle
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from utils.preprocess import build_pipeline, normalize_target

ROOT = Path(__file__).resolve().parent
DATASET_DIR = ROOT / "dataset"
MODELS_DIR = ROOT / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

TASKS = {
    "diabetes": {"dataset": "diabetes.csv", "target": "Outcome", "model_file": "diabetes.pkl"},
    "heart": {"dataset": "heart.csv", "target": "target", "model_file": "heart.pkl"},
    "liver": {"dataset": "liver.csv", "target": "Dataset", "model_file": "liver.pkl"},
}
def train_task(name, dataset_file, target_col, model_file):
    df = pd.read_csv(DATASET_DIR / dataset_file)
    df[target_col] = normalize_target(df[target_col])
    x = df.drop(columns=[target_col])
    y = df[target_col]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
    pipeline = build_pipeline(x, LogisticRegression(max_iter=1000))
    pipeline.fit(x_train, y_train)

    y_pred = pipeline.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    payload = {"pipeline": pipeline, "features": list(x.columns), "accuracy": float(accuracy)}

    with (MODELS_DIR / model_file).open("wb") as file:
        pickle.dump(payload, file)
    print(f"{name}: accuracy={accuracy:.4f}")


def main():
    for key, cfg in TASKS.items():
        train_task(key, cfg["dataset"], cfg["target"], cfg["model_file"])


if __name__ == "__main__":
    main()
