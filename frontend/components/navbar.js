export function navbar(activePage = "", inPages = false, session = null) {
  const publicLinks = [];
  const patientLinks = [];
  const doctorLinks = [];
  const links = !session ? publicLinks : session.role === "doctor" ? doctorLinks : patientLinks;
  const brandHref = inPages ? "../index.html" : "index.html";
  return `<header class="navbar"><div class="navbar-inner"><a class="brand" href="${brandHref}">Neurosense Care</a><nav class="nav-links">${links.map(([href, label, key]) => `<a class="nav-link ${activePage === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}</nav><div class="top-controls"><button id="login-logout-btn" class="btn btn-secondary">${session ? "Logout" : "Login"}</button></div></div></header>`;
}
