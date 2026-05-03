import { navbar } from "../components/navbar.js";
import { card } from "../components/card.js";
import { getSession, setSession, bindNavbarActions } from "./auth.js";
import { postJson } from "./api.js";

const existing = getSession();
if (existing) window.location.href = existing.role === "doctor" ? "doctor-dashboard.html" : "patient-dashboard.html";
document.body.insertAdjacentHTML("afterbegin", navbar("login", true, null));
bindNavbarActions(null, true);
const app = document.getElementById("app");
app.className = "app-shell";
app.innerHTML = `<div class="auth-wrap">${card(`<h2>Login</h2><p class="muted">Use your healthcare account credentials.</p><form id="login-form" class="grid" style="margin-top:14px;"><div class="field"><label>Email</label><input id="email-field" name="email" type="email" value="patient1@gmail.com" required /></div><div class="field"><label>Password</label><input id="password-field" name="password" type="password" value="patient1" required /></div><div class="field"><label>Role</label><div class="select-wrap"><select id="role-field" class="select-base" name="role"><option value="patient">Patient</option><option value="doctor">Doctor</option></select></div></div><button class="btn" type="submit">Login</button><p id="login-error" class="risk-high"></p></form>`)}</div>`;
const roleField = document.getElementById("role-field");
const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");
roleField.addEventListener("change", () => {
  if (roleField.value === "doctor") {
    emailField.value = "doctor1@gmail.com";
    passwordField.value = "doctor1";
  } else {
    emailField.value = "patient1@gmail.com";
    passwordField.value = "patient1";
  }
});
document.getElementById("login-form").addEventListener("submit", async (event) => { event.preventDefault(); const form = new FormData(event.target); try { const response = await postJson("/auth/login", { email: form.get("email"), password: form.get("password"), role: form.get("role") }); setSession(response.session); window.location.href = response.session.role === "doctor" ? "doctor-dashboard.html" : "patient-dashboard.html"; } catch (error) { document.getElementById("login-error").textContent = error.message; } });
