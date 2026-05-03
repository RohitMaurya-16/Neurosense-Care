import { mountLayout } from "./layout.js";
import { ensureRole } from "./auth.js";
import { getJson, putJson } from "./api.js";
import { card } from "../components/card.js";

const session = ensureRole("doctor");
if (!session) throw new Error("Unauthorized");

mountLayout({
  activePage: "doctor-appointments",
  includeSidebar: true,
  title: "Appointments",
  subtitle: "Manage statuses and call links for your patients.",
});

const appointments = await getJson(`/appointments?doctor_id=${session.user.id}`);

document.getElementById("page-content").innerHTML = appointments.length
  ? card(`
      <h3>Doctor Appointments</h3>
      ${appointments
        .map(
          (a) => `
        <div style="margin-bottom:10px;">
          ${a.date} ${a.time} - Patient #${a.patient_id}
          <strong>${a.status || "Pending"}</strong>
          ${a.status !== "Completed" ? `<a href="${a.meeting_link}" target="_blank">Join Call</a>` : ""}
          <div class="select-wrap" style="display:inline-block;margin-left:8px;">
            <select class="select-base appt-status" data-id="${a.id}" style="width:140px;">
              <option ${a.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${a.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
              <option ${a.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
        </div>
      `
        )
        .join("")}
    `)
  : card("<h3>No appointments assigned</h3><p class='muted'>Appointments will appear once booked.</p>");

document.querySelectorAll(".appt-status").forEach((control) => {
  control.addEventListener("change", async () => {
    await putJson(`/appointments/${control.dataset.id}/status`, { status: control.value });
  });
});
