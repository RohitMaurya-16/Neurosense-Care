const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://neurosense-care-backend.onrender.com"; // Placeholder URL for production


async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

export const getJson = (path) => request(path);
export const postJson = (path, payload) => request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const putJson = (path, payload) => request(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
