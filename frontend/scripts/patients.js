import { mountLayout } from "./layout.js";
import { ensureRole } from "./auth.js";
import { getJson } from "./api.js";
import { card } from "../components/card.js";

const session = ensureRole("doctor");
if (!session) throw new Error("Unauthorized");

mountLayout({
  activePage: "patients",
  includeSidebar: true,
  title: "Browse Patients",
  subtitle: "Patients currently managed by you.",
});

const [patients, appointments] = await Promise.all([getJson("/patients"), getJson(`/appointments?doctor_id=${session.user.id}`)]);
const patientIds = [...new Set(appointments.map((a) => a.patient_id))];
const managed = patients.filter((p) => patientIds.includes(p.id));

document.getElementById("page-content").innerHTML =
  managed.length === 0
    ? card("<h3>No managed patients yet</h3><p class='muted'>Book or confirm appointments to populate this list.</p>")
    : `<div class="grid">${managed
        .map(
          (p) => `
      <div class="card patient-card" data-id="${p.id}">
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${p.profile_photo || "https://i.pravatar.cc/120"}" alt="${p.name}" style="width:56px;height:56px;border-radius:999px;object-fit:cover;" />
          <div><h3>${p.name}</h3><p class="muted">Age ${p.age} • ${p.gender}</p></div>
        </div>
        <div class="patient-details" style="display:none;">
          <p><strong>Height:</strong> ${p.height}</p>
          <p><strong>Weight:</strong> ${p.weight}</p>
          <p><strong>Diabetes:</strong> Glucose ${p.medical?.diabetes?.glucose}, BMI ${p.medical?.diabetes?.bmi}, Insulin ${p.medical?.diabetes?.insulin}</p>
          <p><strong>Heart:</strong> BP ${p.medical?.heart?.blood_pressure}, Cholesterol ${p.medical?.heart?.cholesterol}</p>
          <p><strong>Liver:</strong> Bilirubin ${p.medical?.liver?.bilirubin}, Enzymes ${p.medical?.liver?.enzyme_levels}</p>
        </div>
      </div>
    `
        )
        .join("")}</div>`;

document.querySelectorAll(".patient-card").forEach((cardEl) => {
  cardEl.addEventListener("click", () => {
    const details = cardEl.querySelector(".patient-details");
    details.style.display = details.style.display === "none" ? "block" : "none";
  });
});
