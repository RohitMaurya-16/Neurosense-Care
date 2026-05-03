import { mountLayout } from "./layout.js";
import { ensureRole } from "./auth.js";
import { getJson, postJson } from "./api.js";
import { card } from "../components/card.js";

const session = ensureRole("doctor");
if (!session) throw new Error("Unauthorized");

mountLayout({
  activePage: "doctor-chat",
  includeSidebar: true,
  title: "Chat with Patient",
  subtitle: "Secure conversations with your assigned patients.",
});

const appointments = await getJson(`/appointments?doctor_id=${session.user.id}`);
const patientIds = [...new Set(appointments.map((a) => a.patient_id))];
const patients = await getJson("/patients");
const contacts = patients.filter((p) => patientIds.includes(p.id));

let selected = contacts[0] || null;

document.getElementById("page-content").innerHTML = card(`
  <div class="chat-layout">
    <div class="card">
      <h3>Patients</h3>
      <div id="chat-contact-list" class="grid" style="margin-top:10px;"></div>
    </div>
    <div class="card">
      <h3 id="chat-title">${selected ? selected.name : "No patient available"}</h3>
      <div id="chat-thread" class="chat-box" style="margin-top:10px;"></div>
      <form id="chat-form" style="display:flex;gap:8px;margin-top:8px;">
        <input class="input-base" name="message" style="flex:1;" placeholder="Type your message" />
        <button class="btn" type="submit">Send</button>
      </form>
    </div>
  </div>
`);

function renderContacts() {
  const container = document.getElementById("chat-contact-list");
  container.innerHTML =
    contacts.map((c) => `<button class="chat-list-item ${selected && c.id === selected.id ? "active" : ""}" data-id="${c.id}">${c.name}</button>`).join("") ||
    "<p class='muted'>No patient chats available.</p>";
  container.querySelectorAll(".chat-list-item").forEach((btn) =>
    btn.addEventListener("click", async () => {
      selected = contacts.find((c) => String(c.id) === String(btn.dataset.id));
      document.getElementById("chat-title").textContent = selected.name;
      renderContacts();
      await loadThread();
    })
  );
}

async function loadThread() {
  if (!selected) {
    document.getElementById("chat-thread").innerHTML = "<p class='muted'>No active conversation.</p>";
    return;
  }
  const messages = await getJson(`/messages?doctor_id=${session.user.id}&patient_id=${selected.id}`);
  document.getElementById("chat-thread").innerHTML =
    messages.map((m) => `<div class="message ${m.sender_role === "doctor" ? "user" : "bot"}"><strong>${m.sender_name}:</strong> ${m.message}</div>`).join("") ||
    "<p class='muted'>No messages yet.</p>";
}

document.getElementById("chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selected) return;
  const message = String(new FormData(event.target).get("message") || "").trim();
  if (!message) return;
  await postJson("/messages", {
    doctor_id: session.user.id,
    patient_id: selected.id,
    sender_role: "doctor",
    sender_name: session.user.name,
    message,
    timestamp: new Date().toISOString(),
  });
  event.target.reset();
  await loadThread();
});

renderContacts();
await loadThread();
