import { mountLayout } from "./layout.js";
import { getJson, putJson } from "./api.js";
import { card } from "../components/card.js";
import { requireAuth, setSession } from "./auth.js";

const session = requireAuth();
if (!session) throw new Error("Unauthorized");
mountLayout({ activePage: "profile", includeSidebar: true, title: "Profile", subtitle: "Update personal and clinical information." });

if (session.role === "doctor") {
  const doc = await getJson(`/doctors/${session.user.id}`);
  document.getElementById("page-content").innerHTML = card(`<form id="doctor-form" class="grid"><h3>${doc.name}</h3><div class="field"><label>Specialization</label><input name="specialization" value="${doc.specialization}" /></div><div class="grid grid-2"><div class="field"><label>Qualification</label><input name="qualification" value="${doc.qualification}" /></div><div class="field"><label>Experience</label><input name="experience" value="${doc.experience}" /></div></div><button class="btn">Save Profile</button></form><p id="doctor-msg" class="muted"></p>`);
  document.getElementById("doctor-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const updated = await putJson(`/doctors/${session.user.id}`, {
      specialization: String(form.get("specialization")),
      qualification: String(form.get("qualification")),
      experience: String(form.get("experience")),
    });
    setSession({ ...session, user: updated });
    document.getElementById("doctor-msg").textContent = "Doctor profile updated successfully.";
  });
} else {
  const patient = await getJson(`/patients/${session.user.id}`);
  document.getElementById("page-content").innerHTML = card(`<form id="profile-form" class="grid"><h3>${patient.name}</h3><div class="grid grid-2"><div class="field"><label>Age</label><input name="age" value="${patient.age}" /></div><div class="field"><label>Gender</label><input name="gender" value="${patient.gender}" /></div><div class="field"><label>Height</label><input name="height" value="${patient.height}" /></div><div class="field"><label>Weight</label><input name="weight" value="${patient.weight}" /></div></div><h4>Diabetes</h4><div class="grid grid-3"><input name="glucose" value="${patient.medical.diabetes.glucose}" /><input name="bmi" value="${patient.medical.diabetes.bmi}" /><input name="insulin" value="${patient.medical.diabetes.insulin}" /></div><h4>Heart</h4><div class="grid grid-2"><input name="blood_pressure" value="${patient.medical.heart.blood_pressure}" /><input name="cholesterol" value="${patient.medical.heart.cholesterol}" /></div><h4>Liver</h4><div class="grid grid-2"><input name="bilirubin" value="${patient.medical.liver.bilirubin}" /><input name="enzyme_levels" value="${patient.medical.liver.enzyme_levels}" /></div><button class="btn">Save Profile</button></form><p id="profile-msg" class="muted"></p>`);
  document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = {
      age: Number(data.get("age")),
      gender: String(data.get("gender")),
      height: Number(data.get("height")),
      weight: Number(data.get("weight")),
      medical: {
        diabetes: { glucose: Number(data.get("glucose")), bmi: Number(data.get("bmi")), insulin: Number(data.get("insulin")) },
        heart: { blood_pressure: Number(data.get("blood_pressure")), cholesterol: Number(data.get("cholesterol")) },
        liver: { bilirubin: Number(data.get("bilirubin")), enzyme_levels: Number(data.get("enzyme_levels")) },
      },
    };
    const updated = await putJson(`/patients/${session.user.id}`, payload);
    setSession({ ...session, user: updated });
    document.getElementById("profile-msg").textContent = "Profile updated successfully.";
  });
}
