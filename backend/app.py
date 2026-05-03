from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.auth import auth_bp
from routes.patients import patients_bp
from routes.appointments import appointments_bp
from routes.doctors import doctors_bp
from routes.history import history_bp
from routes.mood import mood_bp
from routes.predict import predict_bp
from routes.messages import messages_bp

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(history_bp)
app.register_blueprint(mood_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(messages_bp)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "Neurosense Care API"})


@app.get("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/<path:asset_path>")
def serve_frontend_asset(asset_path):
    return send_from_directory(FRONTEND_DIR, asset_path)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
