import { mountLayout } from "./layout.js";
import { requireAuth } from "./auth.js";
import { card } from "../components/card.js";

const session = requireAuth();
if (!session) throw new Error("Unauthorized");
mountLayout({ activePage: "query", includeSidebar: true, title: "Query", subtitle: "AI chatbot and contact support." });

const rules = [
  { key: "headache", msg: "Drink water, rest in a quiet place, and monitor symptoms." },
  { key: "stress", msg: "Try 4-7-8 breathing and take short breaks every 45 minutes." },
  { key: "fever", msg: "Hydrate and monitor temperature. Consult a doctor if persistent." },
];
function reply(text) {
  const lower = text.toLowerCase();
  const hit = rules.find((r) => lower.includes(r.key));
  return hit ? hit.msg : "Please monitor symptoms and seek professional advice for persistent issues.";
}

document.getElementById("page-content").innerHTML = `
  <div class="grid grid-2">
    ${card(`<h3>AI Chatbot</h3><div class="chat-box" id="chat-box"><div class="message bot">Hello, ask your health query.</div></div><div style="display:flex;gap:8px;margin-top:10px;"><input id="chat-input" class="input-base" style="flex:1;" value="I have stress" /><button id="send-btn" class="btn">Send</button></div>`)}
    ${card(`<h3>Contact Us</h3><p>Email: support@neurosensecare.local</p><p>Phone: +91-98765-43210</p><p>Address: 22 Wellness Avenue, Bengaluru</p>`)}
  </div>
`;
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const box = document.getElementById("chat-box");
  if (!input.value.trim()) return;
  box.insertAdjacentHTML("beforeend", `<div class="message user">${input.value}</div>`);
  box.insertAdjacentHTML("beforeend", `<div class="message bot">${reply(input.value)}</div>`);
  input.value = "";
  box.scrollTop = box.scrollHeight;
});