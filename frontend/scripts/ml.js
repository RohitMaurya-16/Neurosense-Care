import { mountLayout } from "./layout.js";
import { card } from "../components/card.js";
import { postJson, putJson, getJson } from "./api.js";
import { ensureRole, setSession } from "./auth.js";

const session = ensureRole("patient");
if (!session) throw new Error("Unauthorized");
mountLayout({ activePage: "ml", includeSidebar: true, title: "ML Prediction", subtitle: "Select one model and predict from profile-driven inputs." });
const patient = await getJson(`/patients/${session.user.id}`);

const modelDefs = { diabetes: { label: "Diabetes Prediction", fields: [["Glucose", "What is your glucose level?", patient.medical?.diabetes?.glucose ?? ""], ["BMI", "What is your BMI?", patient.medical?.diabetes?.bmi ?? ""], ["Insulin", "What is your insulin level?", patient.medical?.diabetes?.insulin ?? ""], ["Age", "What is your age?", patient.age ?? ""], ["Pregnancies", "How many pregnancies?", 1], ["BloodPressure", "What is your blood pressure?", patient.medical?.heart?.blood_pressure ?? ""], ["SkinThickness", "What is your skin thickness?", 20], ["DiabetesPedigreeFunction", "What is your diabetes pedigree function value?", 0.5]] }, heart: { label: "Heart Disease Prediction", fields: [["age", "What is your age?", patient.age ?? ""], ["trestbps", "What is your resting blood pressure?", patient.medical?.heart?.blood_pressure ?? ""], ["chol", "What is your cholesterol level?", patient.medical?.heart?.cholesterol ?? ""], ["sex", "Sex (1 male, 0 female)", patient.gender === "Male" ? 1 : 0], ["cp", "Chest pain type", 2], ["fbs", "Fasting blood sugar", 0], ["restecg", "Resting ECG value", 1], ["thalach", "Maximum heart rate", 150], ["exang", "Exercise angina", 0], ["oldpeak", "Oldpeak", 1], ["slope", "Slope", 2], ["ca", "CA", 0], ["thal", "Thal", 2]] }, liver: { label: "Liver Disease Prediction", fields: [["Age", "What is your age?", patient.age ?? ""], ["Gender", "What is your gender?", patient.gender ?? ""], ["Total_Bilirubin", "What is your bilirubin level?", patient.medical?.liver?.bilirubin ?? ""], ["Alamine_Aminotransferase", "What are your enzyme levels?", patient.medical?.liver?.enzyme_levels ?? ""], ["Direct_Bilirubin", "What is your direct bilirubin?", 0.3], ["Alkaline_Phosphotase", "What is alkaline phosphotase?", 210], ["Aspartate_Aminotransferase", "What is AST level?", patient.medical?.liver?.enzyme_levels ?? 40], ["Total_Protiens", "What is total proteins value?", 6.8], ["Albumin", "What is albumin value?", 3.4], ["Albumin_and_Globulin_Ratio", "What is A/G ratio?", 1.0]] } };

document.getElementById("page-content").innerHTML = card(`<h3>Select Disease Model</h3><div class="select-wrap"><select id="model-select" class="select-base"><option value="">Choose one</option><option value="diabetes">Diabetes</option><option value="heart">Heart Disease</option><option value="liver">Liver Disease</option></select></div><div style="margin:10px 0;"><a class="btn btn-secondary" href="profile.html">Update info for better prediction</a></div><div id="model-cards" class="grid grid-3">${Object.entries(modelDefs).map(([key,val]) => `<button class="btn btn-secondary model-open" data-model="${key}">${val.label}</button>`).join("")}</div><div id="model-form-wrap" style="margin-top:14px;"></div>`);

function renderForm(modelKey) {
  const model = modelDefs[modelKey];
  if (!model) return;
  const wrap = document.getElementById("model-form-wrap");
  wrap.innerHTML = card(`<h3>${model.label}</h3><form id="predict-form" class="grid">${model.fields.map(([k,q,v]) => `<div class="field"><label>${q}</label><input name="${k}" value="${v}" /></div>`).join("")}<button class="btn">Predict</button></form><div id="predict-result" class="muted"></div>`);
  const form = document.getElementById("predict-form");
  form.addEventListener("change", async () => {
    const f = new FormData(form);
    const med = { ...patient.medical };
    if (modelKey === "diabetes") {
      med.diabetes.glucose = Number(f.get("Glucose"));
      med.diabetes.bmi = Number(f.get("BMI"));
      med.diabetes.insulin = Number(f.get("Insulin"));
    } else if (modelKey === "heart") {
      med.heart.blood_pressure = Number(f.get("trestbps"));
      med.heart.cholesterol = Number(f.get("chol"));
    } else {
      med.liver.bilirubin = Number(f.get("Total_Bilirubin"));
      med.liver.enzyme_levels = Number(f.get("Alamine_Aminotransferase"));
    }
    try {
      const updated = await putJson(`/patients/${session.user.id}`, { medical: med });
      setSession({ ...session, user: updated });
    } catch {
      // Non-blocking save failure for form editing.
    }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {};
    const f = new FormData(form);
    model.fields.forEach(([k, , v]) => (payload[k] = typeof v === "string" ? String(f.get(k)) : Number(f.get(k))));
    try {
      const result = await postJson(`/predict/${modelKey}`, payload);
      const level = result.probability > 0.7 ? "High Risk" : result.probability > 0.4 ? "Medium Risk" : "Low Risk";
      const cls = level === "High Risk" ? "risk-high" : level === "Medium Risk" ? "mood-neutral" : "risk-low";
      document.getElementById("predict-result").innerHTML = `<strong class="${cls}">${level}</strong> <span class="muted">| Probability ${(result.probability * 100).toFixed(2)}%</span>`;
    } catch (error) {
      document.getElementById("predict-result").innerHTML = `<span class="risk-high">Prediction failed: ${error.message}</span>`;
    }
  });
}
document.querySelectorAll(".model-open").forEach((btn) => btn.addEventListener("click", () => renderForm(btn.dataset.model)));
document.getElementById("model-select").addEventListener("change", (e) => renderForm(e.target.value));
