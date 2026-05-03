export function modal({ id, title, content }) {
  return `<div id="${id}" class="modal-backdrop" style="display:none;"><div class="card modal-panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><h3>${title}</h3><button class="btn btn-secondary" data-close="${id}">Close</button></div><div style="margin-top:12px;">${content}</div></div></div>`;
}
export function bindModalClose() {
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.close);
      if (target) target.style.display = "none";
    });
  });
}
