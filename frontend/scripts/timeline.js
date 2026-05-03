import { mountLayout } from "./layout.js";
import { requireAuth } from "./auth.js";
import { getJson } from "./api.js";
import { card } from "../components/card.js";
import { timeline } from "../components/timeline.js";

const session = requireAuth();
if (!session || !["doctor", "patient"].includes(session.role)) throw new Error("Unauthorized");
mountLayout({ activePage: "timeline", includeSidebar: true, title: "Medical Timeline", subtitle: "Chronological care events." });

if (session.role === "patient") {
  const history = await getJson(`/history/${session.user.id}`);
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  document.getElementById("page-content").innerHTML = card(`<h3>Timeline</h3>${timeline(sorted)}`);
} else {
  const patients = await getJson("/patients");
  const selected = Number(localStorage.getItem("timeline_patient_id") || patients[0]?.id || 1);
  const history = await getJson(`/history/${selected}`);
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  document.getElementById("page-content").innerHTML = card(`<h3>Patient Timeline</h3><div class="field"><label>Select Patient</label><div class="select-wrap"><select id="timeline-patient" class="select-base">${patients.map((p) => `<option value="${p.id}" ${Number(p.id) === selected ? "selected" : ""}>${p.name}</option>`).join("")}</select></div></div><div style="margin-top:10px;">${timeline(sorted)}</div>`);
  document.getElementById("timeline-patient").addEventListener("change", (event) => {
    localStorage.setItem("timeline_patient_id", event.target.value);
    window.location.reload();
  });
}