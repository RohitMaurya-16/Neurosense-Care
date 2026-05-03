import { mountLayout } from "./layout.js";
import { ensureRole } from "./auth.js";
import { getJson, postJson } from "./api.js";
import { card } from "../components/card.js";

const session = ensureRole("patient");
if (!session) throw new Error("Unauthorized");
mountLayout({ activePage: "mood", includeSidebar: true, title: "Mood Tracker", subtitle: "31-day calendar view with gradient mood intensity." });

const moods = await getJson(`/mood/${session.user.id}`);
const today = new Date();
const y = today.getFullYear();
const month = today.getMonth() + 1;
const map = Object.fromEntries(moods.map((m) => [m.date, m.mood]));
const cls = (mood) => (["😁", "🙂"].includes(mood) ? "good" : mood === "😐" ? "neutral" : mood ? "bad" : "");

document.getElementById("page-content").innerHTML = card(`
  <h3>Monthly Mood Calendar</h3>
  <div class="grid" style="grid-template-columns:repeat(7,minmax(0,1fr));margin-top:10px;">
    ${Array.from({ length: 31 }, (_, i) => {
      const d = i + 1;
      const date = `${y}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const mood = map[date] || "";
      return `<button class="btn btn-secondary mood-day ${cls(mood)}" data-date="${date}" style="height:72px;"><div>${d}</div><div>${mood}</div></button>`;
    }).join("")}
  </div>
`);

document.querySelectorAll(".mood-day").forEach((btn) =>
  btn.addEventListener("click", async () => {
    const mood = prompt("Enter mood emoji (😞 / 😐 / 🙂 / 😁):", map[btn.dataset.date] || "🙂");
    if (!mood) return;
    await postJson("/mood", { patient_id: session.user.id, date: btn.dataset.date, mood, note: "Mood page update" });
    window.location.reload();
  })
);