import { navbar } from "../components/navbar.js";
import { sidebar } from "../components/sidebar.js";
import { bindNavbarActions, requireAuth, getSession } from "./auth.js";

export function mountLayout({ activePage, includeSidebar = false, title, subtitle, allowPublic = false }) {
  const session = allowPublic ? getSession() : requireAuth();
  if (!allowPublic && !session) return null;
  document.body.insertAdjacentHTML("afterbegin", navbar(activePage, true, session));
  bindNavbarActions(session, true);
  const app = document.getElementById("app");
  app.className = "app-shell";
  if (!includeSidebar) {
    app.innerHTML = `<main class="content"><h2>${title}</h2><p class="muted">${subtitle}</p><div id="page-content" style="margin-top:16px;"></div></main>`;
    return session;
  }
  app.innerHTML = `<div class="layout">${sidebar(session?.role || "patient", activePage, session?.user || null)}<main class="content"><h2>${title}</h2><p class="muted">${subtitle}</p><div id="page-content" style="margin-top:16px;"></div></main></div>`;
  return session;
}
