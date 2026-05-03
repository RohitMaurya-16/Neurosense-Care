import { mountLayout } from "./layout.js";
import { getJson, postJson } from "./api.js";
import { card } from "../components/card.js";
import { timeline } from "../components/timeline.js";
import { ensureRole } from "./auth.js";

const session = ensureRole("patient");
if (!session) {
  // Redirect handled in auth guard.
} else {
  mountLayout({ activePage: "patient-dashboard", includeSidebar: true, title: `Welcome, ${session.user.name}`, subtitle: "Your care overview and health insights." });

  function moodClass(mood) {
    if (["😁", "🙂"].includes(mood)) return "mood-good";
    if (mood === "😐") return "mood-neutral";
    return "mood-bad";
  }

  async function init() {
    const [appointments, history, moodData] = await Promise.all([
      getJson(`/appointments?patient_id=${session.user.id}`),
      getJson(`/history/${session.user.id}`),
      getJson(`/mood/${session.user.id}`),
    ]);
    const latestMood = moodData.length ? moodData[moodData.length - 1].mood : "🙂";
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedMood = [...moodData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentMood = sortedMood.slice(-30).reverse();
    const upcoming = appointments.filter((a) => new Date(a.date) >= new Date()).slice(0, 3);
    const activityCount = sortedHistory.length + sortedMood.length;
    const monthDays = 31;
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const moodByDate = Object.fromEntries(sortedMood.map((entry) => [entry.date, entry.mood]));
    const med = session.user.medical || {};

    document.getElementById("page-content").innerHTML = `
      <div class="grid grid-3">
        ${card(`<div class="kpi"><div class="muted">Upcoming Appointments</div><div class="value">${upcoming.length}</div><div class="muted">Next: ${upcoming[0] ? `${upcoming[0].date} ${upcoming[0].time} (${upcoming[0].status || "Pending"})` : "No upcoming visits"}</div></div>`)}
        ${card(`<div class="kpi"><div class="muted">Recent Activity</div><div class="value">${activityCount}</div><div class="muted">Combined mood + timeline events</div></div>`)}
        ${card(`<div class="kpi"><div class="muted">Health Summary</div><div class="value ${moodClass(latestMood)}">${latestMood}</div><div class="muted">Latest mood indicator</div></div>`)}
      </div>
      ${card(`<div class="kpi"><div class="muted">Mood Trend</div><div class="value">${recentMood.length ? recentMood[0].mood : "N/A"}</div><div class="muted">Open Mood Tracker page for full calendar</div></div>`)}
      ${card(`<div class="kpi"><div class="muted">Timeline Events</div><div class="value">${sortedHistory.length}</div><div class="muted">Open Medical Timeline page for full chronology</div></div>`)}
      ${card(`<div class="kpi"><div class="muted">Profile Snapshot</div><div class="muted">Height: ${session.user.height || "N/A"} cm | Weight: ${session.user.weight || "N/A"} kg</div><div class="muted">Glucose: ${med.diabetes?.glucose ?? "N/A"} | BP: ${med.heart?.blood_pressure ?? "N/A"}</div></div>`)}
      <div style="margin-top:14px;">${card(`
        <h3>Patient Health Details</h3>
        <div class="grid grid-2">
          <p><strong>Height:</strong> ${session.user.height || "N/A"} cm</p>
          <p><strong>Weight:</strong> ${session.user.weight || "N/A"} kg</p>
          <p><strong>Diabetes (Glucose/BMI/Insulin):</strong> ${med.diabetes?.glucose ?? "N/A"} / ${med.diabetes?.bmi ?? "N/A"} / ${med.diabetes?.insulin ?? "N/A"}</p>
          <p><strong>Heart (BP/Cholesterol):</strong> ${med.heart?.blood_pressure ?? "N/A"} / ${med.heart?.cholesterol ?? "N/A"}</p>
          <p><strong>Liver (Bilirubin/Enzymes):</strong> ${med.liver?.bilirubin ?? "N/A"} / ${med.liver?.enzyme_levels ?? "N/A"}</p>
        </div>
      `)}</div>
    `;
  }

  init().catch((e) => {
    document.getElementById("page-content").innerHTML = card(`<h3>Error</h3><p class="muted">${e.message}</p>`);
  });
}
