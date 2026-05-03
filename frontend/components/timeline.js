export function timeline(items) {
  return `<div class="timeline">${items.map((item) => `<div class="timeline-item"><div class="muted">${item.date}</div><strong>${item.title}</strong><div>${item.detail || item.event}</div></div>`).join("")}</div>`;
}
