import { mountLayout } from "./layout.js";
import { ensureRole } from "./auth.js";
import { getJson } from "./api.js";
import { card } from "../components/card.js";
import { timeline } from "../components/timeline.js";

const session = ensureRole("doctor");
if (!session) throw new Error("Unauthorized");

mountLayout({
  activePage: "doctor-timeline",
  includeSidebar: true,
  title: "Medical Timeline",
  subtitle: "Select a patient to view chronological medical events.",
});

const patients = await getJson("/patients");
const selected = Number(localStorage.getItem("doctor_timeline_patient_id") || patients[0]?.id || 1);
const history = await getJson(`/history/${selected}`);
const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

document.getElementById("page-content").innerHTML = card(`
  <h3>Patient Timeline</h3>
  <div class="field">
    <label>Select Patient</label>
    <div class="select-wrap">
      <select id="timeline-patient" class="select-base">
        ${patients.map((p) => `<option value="${p.id}" ${Number(p.id) === selected ? "selected" : ""}>${p.name}</option>`).join("")}
      </select>
    </div>
  </div>
  <div style="margin-top:10px;">${timeline(sorted)}</div>
`);

document.getElementById("timeline-patient").addEventListener("change", (event) => {
  localStorage.setItem("doctor_timeline_patient_id", event.target.value);
  window.location.reload();
});
