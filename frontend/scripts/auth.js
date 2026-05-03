const STORAGE_KEY = "neurosense_session";
export const getSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.user) return parsed;
    // Backward compatibility for older session shape.
    return { role: parsed.role, user: { id: 1, name: parsed.username || "User" } };
  } catch {
    return null;
  }
};
export const setSession = (session) => localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(STORAGE_KEY);

export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

export function ensureRole(expectedRole) {
  const session = requireAuth();
  if (!session) return null;
  if (session.role !== expectedRole) {
    window.location.href = session.role === "doctor" ? "doctor-dashboard.html" : "patient-dashboard.html";
    return null;
  }
  return session;
}

export function bindNavbarActions(session, inPages = false) {
  const loginBtn = document.getElementById("login-logout-btn");
  if (loginBtn) {
    loginBtn.textContent = session ? "Logout" : "Login";
    loginBtn.addEventListener("click", () => {
      if (session) {
        clearSession();
        window.location.href = inPages ? "../index.html" : "index.html";
        return;
      }
      window.location.href = inPages ? "login.html" : "pages/login.html";
    });
  }
}
