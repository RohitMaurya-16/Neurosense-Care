export function sidebar(role = "patient", activePage = "", profile = null) {
  const patientItems = [
    ["patient-dashboard.html", "Dashboard", "patient-dashboard"],
    ["mood.html", "Mood Tracker", "mood"],
    ["timeline.html", "Medical Timeline", "timeline"],
    ["ml.html", "Disease Prediction", "ml"],
    ["appointment.html", "Book Appointment", "appointment"],
    ["chat.html", "Ask the Doctor", "ask-doctor"],
    ["query.html", "Query", "query"],
  ];
  const doctorItems = [
    ["doctor-dashboard.html", "Dashboard", "doctor-dashboard"],
    ["doctor-appointments.html", "Appointments", "doctor-appointments"],
    ["doctor-timeline.html", "Medical Timeline", "doctor-timeline"],
    ["doctor-chat.html", "Chat with Patient", "doctor-chat"],
  ];
  const items = role === "doctor" ? doctorItems : patientItems;
  const top = profile
    ? role === "doctor"
      ? `<div class="card" style="margin-bottom:10px;"><img src="${profile.profile_image}" alt="profile" style="width:54px;height:54px;border-radius:999px;object-fit:cover;" /><h4 style="margin:8px 0 4px;">${profile.name}</h4><p class="muted">${profile.age} yrs • ${profile.qualification}</p><p class="muted">${profile.experience}</p></div>`
      : `<div class="card" style="margin-bottom:10px;"><img src="${profile.profile_photo}" alt="profile" style="width:54px;height:54px;border-radius:999px;object-fit:cover;" /><h4 style="margin:8px 0 4px;">${profile.name}</h4><p class="muted">${profile.age} yrs • ${profile.gender}</p></div>`
    : "";
  return `<aside class="sidebar">${top}<h4>${role === "doctor" ? "Doctor Workspace" : "Patient Workspace"}</h4>${items.map(([href, label, key]) => `<a class="${activePage === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}</aside>`;
}
