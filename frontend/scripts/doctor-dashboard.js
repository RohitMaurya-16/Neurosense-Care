import { mountLayout } from "./layout.js";
import { getJson } from "./api.js";
import { card } from "../components/card.js";
import { ensureRole } from "./auth.js";

const session = ensureRole("doctor");
if (!session) {
  // Redirect handled in auth guard.
} else {
  mountLayout({ activePage: "doctor-dashboard", includeSidebar: true, title: `Welcome, ${session.user.name}`, subtitle: "Doctor overview and quick access." });

  async function init() {
    const [patients, appointments, messages] = await Promise.all([
      getJson("/patients"),
      getJson(`/appointments?doctor_id=${session.user.id}`),
      getJson(`/messages?doctor_id=${session.user.id}`),
    ]);
    const managedPatientIds = [...new Set(appointments.map((a) => Number(a.patient_id)))];
    const managedPatients = patients.filter((p) => managedPatientIds.includes(Number(p.id)));
    const upcoming = appointments.filter((a) => new Date(a.date) >= new Date());
    document.getElementById("page-content").innerHTML = `
      <div class="grid grid-3">
        ${card(`<div class="kpi"><div class="muted">Total Patients</div><div class="value">${managedPatients.length}</div></div>`)}
        ${card(`<div class="kpi"><div class="muted">Upcoming Appointments</div><div class="value">${upcoming.length}</div></div>`)}
        ${card(`<div class="kpi"><div class="muted">Message Threads</div><div class="value">${new Set(messages.map((m) => m.patient_id)).size}</div></div>`)}
      </div>
      <div style="margin-top:14px;">
        ${card(`
          <h3>Your Patients</h3>
          ${
            managedPatients.length
              ? `<div class="grid">${
                  managedPatients
                    .map(
                      (p) => `
                        <div class="card patient-card">
                          <div style="display:flex;gap:12px;align-items:center;">
                            <img src="${p.profile_photo || "https://i.pravatar.cc/120"}" alt="${p.name}" style="width:52px;height:52px;border-radius:999px;object-fit:cover;" />
                            <div>
                              <h3>${p.name}</h3>
                              <p class="muted">Age ${p.age} • ${p.gender}</p>
                            </div>
                          </div>
                          <div style="margin-top:8px;">
                            <p><strong>Height:</strong> ${p.height || "N/A"} cm</p>
                            <p><strong>Weight:</strong> ${p.weight || "N/A"} kg</p>
                          </div>
                        </div>
                      `
                    )
                    .join("")
                }</div>`
              : "<p class='muted'>No patients assigned yet through appointments.</p>"
          }
        `)}
      </div>
    `;
  }

  init();
}
