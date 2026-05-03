import { mountLayout } from "./layout.js";
import { getJson, postJson } from "./api.js";
import { card } from "../components/card.js";
import { modal, bindModalClose } from "../components/modal.js";
import { requireAuth } from "./auth.js";

const session = requireAuth();
if (!session) {
  // Redirect handled in auth guard.
} else {
  mountLayout({ activePage: "appointment", includeSidebar: true, title: "Book Appointment", subtitle: "Appointment booking is handled only here." });

  async function init() {
    const doctors = await getJson("/doctors");
    const patientId = session.role === "patient" ? session.user.id : 1;
    const existing = await getJson(session.role === "doctor" ? "/appointments" : `/appointments?patient_id=${patientId}`);
    document.getElementById("page-content").innerHTML = card(`
      <form id="appointment-form" class="grid grid-2">
        <div class="field"><label>Patient ID</label><input type="number" name="patient_id" value="${patientId}" min="1" ${session.role === "patient" ? "readonly" : ""} required></div>
        <div class="field"><label>Select Doctor</label><select name="doctor_id">${doctors.map((d) => `<option value="${d.id}">${d.name} (${d.specialization})</option>`).join("")}</select></div>
        <div class="field"><label>Select Date</label><input type="date" name="date" value="2026-04-20" required></div>
        <div class="field"><label>Select Time</label><input type="time" name="time" value="11:00" required></div>
        <button class="btn" style="grid-column:1 / -1;" type="submit">Submit Booking</button>
      </form>
      <div style="margin-top:14px;">
        <h3>Appointment Status</h3>
        ${existing.length ? existing.map((a) => `<p>${a.date} ${a.time} - <strong>${a.status || "Pending"}</strong></p>`).join("") : "<p class='muted'>No appointments yet.</p>"}
      </div>
    `) + modal({ id: "success-modal", title: "Appointment Confirmed", content: "<p>Your booking has been recorded.</p>" });
    bindModalClose();

    document.getElementById("appointment-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      await postJson("/appointments", {
        patient_id: Number(data.get("patient_id")),
        doctor_id: Number(data.get("doctor_id")),
        date: data.get("date"),
        time: data.get("time"),
        status: "Pending",
      });
      document.getElementById("success-modal").style.display = "grid";
    });
  }

  init();
}
