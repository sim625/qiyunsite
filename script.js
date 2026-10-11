// ============ 持续运营天数 ============
const startDate = new Date("2026-08-09T00:00:00");
const now = new Date();
const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
document.getElementById("days").textContent = days;
document.getElementById("stat-days").textContent = days;

// ============ FAQ 折叠 ============
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});