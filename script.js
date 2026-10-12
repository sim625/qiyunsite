// ============ 持续运营天数 ============
const startDate = new Date("2026-08-09T00:00:00");
const now = new Date();
const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
const daysEl = document.getElementById("days");
const statDaysEl = document.getElementById("stat-days");
if (daysEl) daysEl.textContent = days;
if (statDaysEl) {
  statDaysEl.textContent = days;
  statDaysEl.setAttribute("data-target", days);
}

// ============ FAQ 折叠 ============
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

// ============ 首屏打字机效果 ============
const sloganText = "红石生电 · 休闲生存 · 原版客户端即可加入";
const sloganEl = document.getElementById("slogan");
if (sloganEl) {
  sloganEl.textContent = "";  // 先清空
  let i = 0;
  function typeWriter() {
    if (i < sloganText.length) {
      sloganEl.textContent += sloganText.charAt(i);
      i++;
      setTimeout(typeWriter, 80);
    }
  }
  setTimeout(typeWriter, 500);
}

// ============ 数据卡片滚动数字 ============
function animateNumber(el) {
  const target = el.getAttribute("data-target");
  if (!target) return;

  if (/^\d+$/.test(target)) {
    const end = parseInt(target);
    let current = 0;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  } else {
    el.style.opacity = "0";
    el.textContent = target;
    setTimeout(() => { el.style.transition = "opacity 0.6s"; el.style.opacity = "1"; }, 100);
  }
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => statsObserver.observe(el));

// ============ 服务器地址一键复制 ============
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.getAttribute("data-copy");
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "已复制";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "复制";
        btn.classList.remove("copied");
      }, 1500);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.textContent = "已复制";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "复制";
        btn.classList.remove("copied");
      }, 1500);
    });
  });
});

// ============ 导航栏当前板块高亮 ============
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

if (sections.length > 0) {
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });

    // 如果滚到页面最底部，强制高亮最后一个板块
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      current = sections[sections.length - 1].getAttribute("id");
    }

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
}

// ============ 通用提示框 ============
const toast = document.getElementById("toast");
let toastTimer = null;
let toastHideTimer = null;

const DEFAULT_TOAST_TEXT = "又被我整到了吧~你好坏！";
const PAGE_TOAST_TEXT = "已经在这个页面了~ 或者…… 你在尝试找到所有彩蛋？那是不可能的！";

function showToast(message) {
  if (!toast) return;
  const toastText = toast.querySelector(".toast-text");
  const toastBarFill = toast.querySelector(".toast-bar-fill");

  if (toastTimer) clearTimeout(toastTimer);
  if (toastHideTimer) clearTimeout(toastHideTimer);

  toastText.textContent = message;

  toast.classList.remove("show");
  toastBarFill.style.animation = "none";
  void toast.offsetWidth;
  toastBarFill.style.animation = "";

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toastHideTimer = setTimeout(() => {
      toastText.textContent = DEFAULT_TOAST_TEXT;
    }, 320);
  }, 3000);
}

// ============ 导航栏彩蛋 ============
const currentPageId = document.body.getAttribute("data-current-page") || "home";

// 只有非首页才检测
if (currentPageId !== "home") {
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", (e) => {
      const targetPage = link.getAttribute("data-page");
      if (targetPage === currentPageId) {
        e.preventDefault();
        showToast(PAGE_TOAST_TEXT);
      }
    });
  });
}

// ============ 玩家名彩蛋 ============
document.querySelectorAll(".player-name").forEach(el => {
  el.addEventListener("click", () => {
    showToast(DEFAULT_TOAST_TEXT);
  });
});
// ============ 加载动画 ============
const loader = document.getElementById("loader");
if (loader) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), 500);
    }, 800);
  });
}

// ============ 鼠标光效 ============
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
    cursorGlow.classList.add("active");
  });
  document.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("active");
  });
}

// ============ 手机端汉堡菜单 ============
const navToggle = document.getElementById("navToggle");
const navLinksEl = document.getElementById("navLinks");

if (navToggle && navLinksEl) {
  navToggle.addEventListener("click", () => {
    navLinksEl.classList.toggle("open");
  });
}
// ============ 点击 Logo 彩蛋 ============
const navLogo = document.querySelector(".nav-logo");
if (navLogo) {
  let logoClickCount = 0;
  let logoTimer = null;

  navLogo.style.cursor = "pointer";
  navLogo.style.userSelect = "none";

  navLogo.addEventListener("click", () => {
    logoClickCount++;

    // 重置计时器，2 秒内没继续点就清零
    if (logoTimer) clearTimeout(logoTimer);
    logoTimer = setTimeout(() => {
      logoClickCount = 0;
    }, 2000);

    if (logoClickCount >= 5) {
      showToast("一直戳我干嘛！还不赶快去栖云服玩！");
      logoClickCount = 0;
      if (logoTimer) clearTimeout(logoTimer);
    }
  });
}

// ============ 禁止复制/右键 ============
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("contextmenu", (e) => e.preventDefault());