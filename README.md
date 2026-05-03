# Neurosense Care

Neurosense Care is a role-based healthcare web platform built using:
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Flask (Python)
- Machine Learning: scikit-learn models saved as `.pkl`

This README is written for beginners, project demos, and viva preparation.

---

## 🧠 Project Overview

### What is this project?
Neurosense Care is a healthcare management platform where two types of users (Patient and Doctor) can log in and use role-specific features.

### What problem does it solve?
In many small healthcare setups, patient records, mood logs, appointments, and doctor communication are scattered across different tools. This project combines them into one place.

### Why this project is useful
- Centralized care workflow
- Clean and simple UI for non-technical users
- Local ML-based risk prediction support
- Easy to run for learning and demos (no database setup required)

### Real-world use case
A clinic can use this kind of system to:
- Manage appointments and statuses
- Track patient mood and medical timeline
- Enable doctor-patient chat
- Support quick disease risk checks from patient profile data

---

## 🎯 Features

### 1) Login System (Patient & Doctor)
User selects role, enters email/password, and logs in.  
Why this is used: to show different UI and actions based on user type.  
Doctor and patient cannot access each other's protected pages.

### 2) Appointment System
Patients can book appointments; doctors can view and update status.  
Status values: `Pending`, `Confirmed`, `Completed`.  
Why this is used: to manage the treatment workflow clearly.

### 3) Chat System (Doctor ↔ Patient)
Doctors and patients can message only relevant contacts linked via appointments.  
Chats are scoped using both `doctor_id` and `patient_id`.  
Why this is used: privacy and conversation separation.

### 4) Mood Tracker (Calendar-Based)
Patient mood is tracked by day on a calendar view with emoji-style feedback.  
Moods are stored and can be updated for a specific date.  
Why this is used: emotional trend tracking as part of health monitoring.

### 5) Medical Timeline
Chronological view of medical events/history.  
Doctors can select patient first, then view that patient's timeline.  
Why this is used: understand care history quickly.

### 6) ML Disease Prediction
Predicts risk for:
- Diabetes
- Heart disease
- Liver disease  
Why this is used: early risk awareness support (not a final diagnosis).

### 7) Profile-Based Predictions
ML forms auto-fill from patient profile medical data.  
If user updates health fields, backend stores updates for future predictions.  
Why this is used: reduce repeated data entry and improve usability.

### 8) Dashboard (Patient & Doctor)
- Patient dashboard: health-focused summary and personal data blocks.
- Doctor dashboard: operational summary and patient blocks.  
Why this is used: role-specific quick overview.

### 9) Query Page (AI Chatbot + Contact)
Rule-based assistant for basic health guidance plus contact section.  
Why this is used: provide simple support without external AI dependency.

---

## 🏗️ Project Architecture

This project follows a **3-layer architecture**:

1. **Frontend (UI Layer)**  
   Shows pages, captures user actions, and sends API calls.

2. **Backend (Logic + API Layer)**  
   Validates requests, reads/writes JSON files, returns responses.

3. **ML Layer (Prediction Layer)**  
   Trains models (`train.py`) and serves predictions through backend routes.

### How they interact
Frontend -> Backend API -> JSON/ML -> Backend Response -> Frontend UI update

This design is simple and beginner-friendly because each layer has a clear responsibility.

---

## 📁 Project Structure (Detailed)

```text
Web Tech Project/
│
├── frontend/ [All UI files]
│   ├── index.html [Homepage entry file]
│   ├── components/ [Reusable UI building blocks]
│   │   ├── card.js [Reusable card wrapper]
│   │   ├── modal.js [Popup modal component]
│   │   ├── navbar.js [Top navigation renderer]
│   │   ├── rating.js [Star rating renderer]
│   │   ├── sidebar.js [Role-based sidebar renderer]
│   │   └── timeline.js [Timeline HTML component]
│   ├── pages/ [Individual page templates]
│   │   ├── login.html [Login page]
│   │   ├── patient-dashboard.html [Patient dashboard page]
│   │   ├── doctor-dashboard.html [Doctor dashboard page]
│   │   ├── appointment.html [Appointment booking page]
│   │   ├── mood.html [Mood tracker calendar page]
│   │   ├── timeline.html [Patient/doctor timeline page]
│   │   ├── ml.html [Disease prediction page]
│   │   ├── chat.html [Doctor-patient chat page]
│   │   ├── query.html [Rule-based query + contact page]
│   │   ├── profile.html [Profile update page]
│   │   ├── patients.html [Doctor patient-list page]
│   │   ├── doctor-appointments.html [Doctor appointment management page]
│   │   ├── doctor-timeline.html [Doctor timeline with patient selector]
│   │   └── doctor-chat.html [Doctor-only chat workspace page]
│   ├── scripts/ [Page behavior and API logic]
│   │   ├── api.js [GET/POST/PUT request helpers]
│   │   ├── auth.js [Session handling and auth guards]
│   │   ├── layout.js [Shared layout mount logic]
│   │   ├── index.js [Homepage rendering logic]
│   │   ├── login.js [Login submit and redirect logic]
│   │   ├── patient-dashboard.js [Patient dashboard data rendering]
│   │   ├── doctor-dashboard.js [Doctor dashboard data rendering]
│   │   ├── appointment.js [Appointment booking logic]
│   │   ├── mood.js [Mood calendar fetch/update logic]
│   │   ├── timeline.js [Timeline fetch/render logic]
│   │   ├── ml.js [ML form + prediction API logic]
│   │   ├── chat.js [Generic doctor-patient chat logic]
│   │   ├── query.js [Rule-based chatbot logic]
│   │   ├── profile.js [Profile load/update logic]
│   │   ├── patients.js [Doctor-managed patients list logic]
│   │   ├── doctor-appointments.js [Doctor appointment status updates]
│   │   ├── doctor-timeline.js [Doctor timeline selector logic]
│   │   └── doctor-chat.js [Doctor chat page logic]
│   └── styles/
│       └── main.css [Global theme and UI styles]
│
├── backend/ [Flask API server]
│   ├── app.py [Main Flask app + frontend static serving]
│   ├── requirements.txt [Python dependencies for backend]
│   ├── routes/ [API endpoint modules]
│   │   ├── auth.py [Login validation endpoints]
│   │   ├── patients.py [Patient read/update endpoints]
│   │   ├── doctors.py [Doctor read/update endpoints]
│   │   ├── appointments.py [Appointment CRUD/status endpoints]
│   │   ├── history.py [Medical history endpoints]
│   │   ├── mood.py [Mood add/get endpoints]
│   │   ├── messages.py [Chat messages endpoints]
│   │   └── predict.py [ML prediction endpoints]
│   ├── utils/
│   │   └── file_handler.py [JSON file read/write helper]
│   └── data/ [JSON data storage]
│       ├── users.json [Patient login + profile data]
│       ├── doctors.json [Doctor login + profile data]
│       ├── appointments.json [Appointment records]
│       ├── history.json [Medical timeline records]
│       ├── mood.json [Daily mood entries]
│       └── messages.json [Doctor-patient chat messages]
│
├── ml-model/ [Local ML training and prediction workspace]
│   ├── train.py [Train all disease models and save `.pkl`]
│   ├── predict.py [Load model and return prediction output]
│   ├── requirements.txt [ML dependencies]
│   ├── dataset/ [Training CSV datasets]
│   ├── models/ [Saved trained model files]
│   │   ├── diabetes.pkl [Trained diabetes model + metadata]
│   │   ├── heart.pkl [Trained heart model + metadata]
│   │   └── liver.pkl [Trained liver model + metadata]
│   └── utils/
│       └── preprocess.py [Preprocessing pipeline utilities]
│
├── run_project.bat [Starts project from backend in one command]
└── README.md [Project documentation and viva guide]
```

### `frontend/` explanation
- `pages/`: individual screen HTML files.
- `scripts/`: page logic, API calls, role checks, rendering.
- `components/`: reusable UI blocks.
- `styles/main.css`: all theme, layout, and animation styling.
- `index.html`: landing/home page entry point.

### `backend/` explanation
- `app.py`: starts Flask, registers all routes, serves frontend at `http://127.0.0.1:5000`.
- `routes/`: each file handles one domain (auth, appointments, mood, etc).
- `utils/file_handler.py`: helper for safe JSON read/write.
- `data/*.json`: acts as mini database for this project.
- `requirements.txt`: backend dependencies.

### `ml-model/` explanation
- `train.py`: trains all models and saves `.pkl` files.
- `predict.py`: reusable prediction utility script.
- `utils/preprocess.py`: preprocessing pipeline helpers.
- `models/`: trained model files used by backend prediction APIs.
- `dataset/`: source datasets for training.

---

## 🔄 Data Flow (Step-by-step)

### General flow
1. User opens page.
2. Frontend checks session and role.
3. Frontend sends API request (for example: appointments, mood, profile).
4. Backend route receives request.
5. Backend reads/writes JSON data.
6. Backend sends JSON response.
7. Frontend renders updated UI.

### Login flow
1. User selects role and enters credentials.
2. Frontend sends `POST /auth/login`.
3. Backend checks user in `users.json` or `doctors.json`.
4. On success, frontend stores session in localStorage.
5. User is redirected to role-specific dashboard.

### ML prediction flow
1. User opens ML page and selects disease model.
2. Form gets auto-filled from profile data.
3. Frontend sends input to:
   - `POST /predict/diabetes` or
   - `POST /predict/heart` or
   - `POST /predict/liver`
4. Backend loads corresponding `.pkl` model.
5. Model returns prediction + risk label/probability (if available).
6. Frontend shows result as risk indicator.

---

## 🔐 Login System

- Role-based login supports `patient` and `doctor`.
- Validation is done in backend route `auth.py`.
- Login data source:
  - Patients -> `backend/data/users.json`
  - Doctors -> `backend/data/doctors.json`
- Session is stored in browser localStorage.

Why this approach?  
It is easy to understand for beginners and enough for demo projects.

---

## 💬 Chat System

- Chat exists between doctor and patient only.
- Messages are stored in `backend/data/messages.json`.
- Each message includes `doctor_id`, `patient_id`, sender info, text, timestamp.
- Frontend fetches chat by pair, so one conversation does not mix with others.

Why separation matters?  
Because medical communication should stay private per doctor-patient relationship.

---

## 📅 Appointment System

- Patients book appointments from appointment page.
- Backend stores appointment in `appointments.json`.
- Doctor can update status:
  - `Pending`
  - `Confirmed`
  - `Completed`
- Meeting link is included for virtual call simulation.

Why status tracking is useful?  
It makes workflow transparent for both sides.

---

## 😊 Mood Tracker

- Calendar-based mood logging page.
- Each date can store one mood entry.
- Backend supports add/update behavior for same date.
- Visual coloring helps quickly identify positive/neutral/negative trend.

Why this feature?  
Mental state is a useful part of regular health monitoring.

---

## 🧠 ML Model (Simple explanation)

### Models used
`Logistic Regression` models with preprocessing pipelines from scikit-learn.

### Diseases covered
1. Diabetes
2. Heart disease
3. Liver disease

### How prediction works (easy form)
Input values (like glucose/BP/cholesterol) -> preprocessing -> trained model -> predicted risk output.

### ML Summary Table (Algorithm + Accuracy)

| Disease | Algorithm Used | Accuracy (from trained `.pkl`) | Why this algorithm is used |
|---|---|---:|---|
| Diabetes | Logistic Regression | 92.00% | Fast, easy to interpret, and good for binary classification (Risk / No Risk). |
| Heart Disease | Logistic Regression | 85.00% | Works well for tabular clinical data and gives stable baseline performance. |
| Liver Disease | Logistic Regression | 83.00% | Simple and reliable model for quick risk estimation in a beginner project. |

> Note: Accuracy values are read from your currently saved model files in `ml-model/models`.  
> They may change if you retrain with different data or settings.

### Algorithm explanation for each disease (very simple)

#### 1) Diabetes Prediction - Logistic Regression
- What it does: It calculates the probability that a patient is in the risk class using input fields like glucose, BMI, insulin, etc.
- Why suitable here: Diabetes outcome is binary (0/1), and Logistic Regression is made for this type of problem.
- Benefit: Fast prediction and easy to explain in viva.

#### 2) Heart Disease Prediction - Logistic Regression
- What it does: It combines factors like blood pressure, cholesterol, and other health indicators to estimate heart disease risk probability.
- Why suitable here: Clinical datasets are often tabular, and Logistic Regression gives a strong and understandable baseline.
- Benefit: Stable behavior and straightforward output interpretation.

#### 3) Liver Disease Prediction - Logistic Regression
- What it does: It uses liver-related metrics (for example bilirubin/enzyme-linked inputs from dataset features) to classify risk.
- Why suitable here: It avoids model complexity while still giving meaningful first-level risk prediction.
- Benefit: Easy to maintain and integrate in backend APIs.

### Preprocessing used before model training
- Missing numeric values -> filled with median
- Missing categorical values -> filled with most frequent value
- Numeric features -> standardized using `StandardScaler`
- Categorical features -> converted using `OneHotEncoder`

Why preprocessing is important:  
It cleans and normalizes data so the model can learn better and produce more reliable predictions.

Important note:  
This is an educational decision-support feature, **not** medical diagnosis.

---

## 📊 Dashboard

### Patient sees
- Personal health summary
- Risk indicators
- Quick access to appointments, mood, timeline, ML, chat, query

### Doctor sees
- Operational summary cards
- Managed patient blocks
- Direct access to appointment management, timeline selection, and chat

### Risk indicator
Risk labels such as low/medium/high are shown after ML prediction to make outputs easy to understand.

---

## 🎨 UI/UX Design

- Theme: dark medical interface (`#0b1220` base).
- Accent colors:
  - Teal (`#14b8a6`) for primary actions
  - Green (`#22c55e`) for positive states
  - Red (`#ef4444`) for warnings/risk
- Rounded cards + soft shadows + clean spacing.
- Minimal top navigation and role-based sidebar.

Why these choices?  
To create a calm, trustworthy, modern healthcare feel.

---

## ⚙️ How To Run Project (Clear steps)

## 1) Prerequisites
- Python 3.10+ installed
- `pip` available in terminal

## 2) Train ML models (first time or after dataset changes)
```bash
cd ml-model
pip install -r requirements.txt
python train.py
```

## 3) Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

## 4) Run complete project (single command)
From project root:
```bash
run_project.bat
```

## 5) Open in browser
Go to: `http://127.0.0.1:5000`

---

## 🧪 Sample Credentials

### Doctors
- `doctor1@gmail.com` / `doctor1`
- `doctor2@gmail.com` / `doctor2`
- `doctor3@gmail.com` / `doctor3`

### Patients
- `patient1@gmail.com` / `patient1`
- `patient2@gmail.com` / `patient2`
- `patient3@gmail.com` / `patient3`

---

## 🔌 API Endpoints (Quick reference)

### Auth
- `POST /auth/login`

### Patients
- `GET /patients`
- `GET /patients/<id>`
- `PUT /patients/<id>`

### Doctors
- `GET /doctors`
- `GET /doctors/<id>`
- `PUT /doctors/<id>`

### Appointments
- `GET /appointments`
- `POST /appointments`
- `PUT /appointments/<appointment_id>/status`

### Mood
- `GET /mood/<patient_id>`
- `POST /mood`

### History
- `GET /history/<patient_id>`
- `POST /history`

### Messages
- `GET /messages`
- `POST /messages`

### ML Prediction
- `POST /predict/diabetes`
- `POST /predict/heart`
- `POST /predict/liver`

---

## ❓ Possible Viva Questions (with short answers)

### 1) Why did you use Flask?
Flask is lightweight and easy to learn. It is great for small to medium APIs and quick prototyping.

### 2) Why JSON instead of database?
For beginner-level development, JSON is simple and readable. It removes DB setup complexity and helps focus on core logic.

### 3) How does ML integrate with the system?
Models are trained in `ml-model`, saved as `.pkl`, and loaded by backend prediction routes. Frontend sends user input to these APIs.

### 4) What is the difference between doctor and patient roles?
Patient focuses on personal health actions (mood, profile, prediction, booking). Doctor focuses on operational actions (patient list, timeline review, appointment management, chat).

### 5) How does chat separation work?
Messages are filtered using both `doctor_id` and `patient_id`, so each conversation stays isolated.

### 6) Why use role-based UI?
It prevents confusion and unauthorized actions. Each user sees only relevant pages and controls.

### 7) Is ML output a diagnosis?
No. It is only a risk indication/support tool and should not replace a doctor's final judgment.

### 8) Why local model files (`.pkl`)?
They are fast to load, easy to version for demos, and avoid external deployment dependency.

### 9) How is frontend served?
Flask serves `frontend/index.html` at `/` and serves other frontend assets via `send_from_directory`.

### 10) How can this project be made production-ready?
Move from JSON to database, add secure authentication, add validation, logs, tests, and deploy with production server setup.

---

## 🚀 Future Improvements

1. **Database integration**  
   Replace JSON files with PostgreSQL or MongoDB for scale and better query support.

2. **Real-time chat**  
   Use WebSockets/Socket.IO for live messaging without page refresh behavior.

3. **Deployment pipeline**  
   Deploy frontend/backend on cloud and use CI/CD for automated testing/build.

4. **Security improvements**  
   Add password hashing, JWT/session security, rate limiting, and stricter input validation.

5. **Better analytics**  
   Add trend charts and doctor-level insights for appointments and patient outcomes.

6. **Testing**  
   Add unit and integration tests for routes, auth, and prediction APIs.

---

## Presentation Tips (For Evaluation/Viva)

- Start with the problem statement: "I built a unified healthcare workflow tool."
- Explain architecture in 3 layers (Frontend, Backend, ML).
- Demo role-based login first (patient vs doctor).
- Show one complete flow:
  - Login -> Book appointment -> Chat -> Prediction
- Mention one technical plus one UX reason for every key feature.
- End with future improvements (database + security + deployment).

---

## Final Note

Neurosense Care is built as a beginner-friendly but structured healthcare platform.  
It is designed to be easy to run, easy to explain, and flexible enough to extend into a production-grade system.
