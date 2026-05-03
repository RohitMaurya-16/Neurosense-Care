export function ratingStars(rating) {
  const filled = Math.round(rating);
  const stars = [1,2,3,4,5].map((v) => `<span style="color:${v <= filled ? "#fbbf24" : "#475569"}">★</span>`).join("");
  return `<div>${stars} <span class="muted">${rating.toFixed(1)}</span></div>`;
}
