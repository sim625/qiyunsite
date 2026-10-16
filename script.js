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
  sloganEl.textContent = "";
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

// ============ 通用提示框（排队版） ============
const toast = document.getElementById("toast");
let toastQueue = [];
let toastPlaying = false;

const DEFAULT_TOAST_TEXT = "又被我整到了吧~你好坏！";
const PAGE_TOAST_TEXT = "已经在这个页面了~ 或者…… 你在尝试找到所有彩蛋？那是不可能的！";

function showToast(message) {
  toastQueue.push({ type: "text", message: message });
  playToastQueue();
}

function typewriterToast(message) {
  toastQueue.push({ type: "type", message: message });
  playToastQueue();
}

function playToastQueue() {
  if (toastPlaying) return;
  if (toastQueue.length === 0) return;
  if (!toast) return;

  toastPlaying = true;
  const item = toastQueue.shift();
  const toastText = toast.querySelector(".toast-text");
  const toastBarFill = toast.querySelector(".toast-bar-fill");

  toast.classList.remove("show");
  toastBarFill.style.animation = "none";
  void toast.offsetWidth;
  toastBarFill.style.animation = "";
  requestAnimationFrame(() => toast.classList.add("show"));

  let totalTime;

  if (item.type === "type") {
    toastText.textContent = "";
    let i = 0;
    function typeChar() {
      if (i < item.message.length) {
        toastText.textContent += item.message.charAt(i);
        i++;
        setTimeout(typeChar, 60);
      }
    }
    typeChar();
    totalTime = item.message.length * 60 + 2000;
  } else {
    toastText.textContent = item.message;
    totalTime = 3000;
  }

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toastText.textContent = DEFAULT_TOAST_TEXT;
      toastPlaying = false;
      playToastQueue();
    }, 320);
  }, totalTime);
}

// ============ 导航栏彩蛋 ============
const currentPageId = document.body.getAttribute("data-current-page") || "home";

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

// ============ 工具页：假功能 ============
const fakeTools = {
  toolMemory: [
    "内存已优化：释放了 0.0001 MB。",
    "内存已优化：其实啥也没干，但看起来很厉害。",
    "内存已优化：你的内存表示它很健康，谢谢关心。",
    "内存已优化：优化了个寂寞。"
  ],
  toolClean: [
    "清理完成：删掉了 1 个快捷方式。",
    "清理完成：垃圾没清掉，倒是把你吓一跳。",
    "清理完成：清理了 0 字节，心情+1。",
    "清理完成：建议你自己动手，我懒。"
  ],
  toolCrash: [
    "强制关闭失败：游戏表示它还想再活一会儿。",
    "强制关闭失败：你确定舍得？",
    "强制关闭失败：Minecraft 拒绝了你的请求。",
    "强制关闭失败：再想想，再想想。"
  ],
  toolBoost: [
    "一键超频：你的 CPU 说它不想。",
    "一键超频：成功把频率提高了 0 Hz。",
    "一键超频：风扇开始起飞。",
    "一键超频：超了，但没完全超。"
  ],
  toolDelete: [
    "清理系统盘：已删除……算了，不敢删。",
    "清理系统盘：检测到 128GB 系统文件，建议别动。",
    "清理系统盘：你认真的？",
    "清理系统盘：已取消，为了你好。"
  ]
};

Object.keys(fakeTools).forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      const list = fakeTools[id];
      const msg = list[Math.floor(Math.random() * list.length)];
      showToast(msg);
    });
  }
});

// ============ 千万别点 ============
const neverClickBtn = document.getElementById("neverClickBtn");
if (neverClickBtn) {
  neverClickBtn.addEventListener("click", () => {
    showToast("嘿！别点我啦！如果你这么闲可以去栖云看看！");
  });
}

// ============ 回声洞 ============
const echoMessages = [
  "这里是回声洞……",
  "你说的每一句话，都会被山谷记住。",
  "栖云之上，云海翻涌。",
  "有人在挖矿，有人在钓鱼，有人在发呆。",
  "红石机器在响，你在想什么？",
  "今天的钻石，挖到了吗？",
  "别熬夜了，明天还要开荒。",
  "愿你的背包永远不炸。",
  "苦力怕：嘶——",
  "欢迎来到栖云，祝你玩得开心。",
  "\"白天晚上，白天晚上，白天晚上，白天晚上，白天晚上……\"你的假期就这么过去了？",
  "开始了？结束了？",
  "巴山楚水凄凉地，李白单杀白居易",
  "你挖的不是矿，是时间的碎片。",
  "你钓的不是鱼，是服务器的耐心。",
  "你建的不是房子，是未来的遗迹。",
  "你跑的不是图，是人生的迷宫。",
  "你睡的不是觉，是离线挂机。",
  "你吃的不是面包，是饱食度。",
  "你喝的不是药水，是短暂的希望。",
  "栖云不是地方，栖云是一种延迟。",
  "云海翻涌，而你还在加载区块。",
  "山不说话，是因为它在等服务器重启。",
  "回声洞没有底，就像你的背包。",
  "你以为你在玩栖云，其实是栖云在玩你。",
  "你下线之后，世界还在响。",
  "红石不会累，但你会。",
  "TNT 不知道答案，但它能让你忘记问题。",
  "末影人搬走了你的方块，也搬走了你的初心。",
  "村民哼了一声，世界就涨价了。",
  "床前明月光，疑似地上霜，举头望明月，低头在挖矿。",
  "春眠不觉晓，处处闻苦力怕。",
  "夜来风雨声，钻石落谁家。",
  "千山鸟飞绝，万径人踪灭，孤舟蓑笠翁，独钓寒江雪，然后被溺尸打了。",
  "白日依山尽，黄河入海流，欲穷千里目，区块没加载。",
  "锄禾日当午，汗滴禾下土，谁知盘中餐，全是腐肉。",
  "红豆生南国，春来发几枝，愿君多采撷，此物最相思，但不能吃。",
  "人生自古谁无死，留取丹心照汗青，然后掉进岩浆。",
  "天生我材必有用，千金散尽还复来，然后背包满了。",
  "山重水复疑无路，柳暗花明又一村，然后迷路了。",
  "服务器卡了，但你的心还在跳。",
  "TPS 低了，梦想也低了。",
  "有人在主城挂机，有人在末地失踪。",
  "你在群里问怎么去栖云，别人说：先学会飞。",
  "管理在修 bug，bug 在修管理。",
  "插件在更新，玩家在失忆。",
  "备份是昨天的，崩溃是今天的。",
  "重启能解决 99% 的问题，剩下的 1% 是你不肯重启。",
  "你以为是网络问题，其实是命运。",
  "你以为是命运，其实是没开加速器。",
  "挖矿挖到 bedrock，人生挖到边界。",
  "钻石就在下一格，下一格永远是岩浆。",
  "你向右挖，左边塌了。",
  "你向下挖，掉进洞穴。",
  "你向上挖，沙子埋了你。",
  "你向前挖，苦力怕等你。",
  "你向后挖，还是苦力怕。",
  "你原地不动，苦力怕也来了。",
  "你挖到了远古残骸，也挖到了孤独。",
  "你挖到了下界合金，也挖到了凌晨四点。",
  "钓鱼佬永不空军，除非服务器维护。",
  "你钓上来一本书，书名是《如何不钓鱼》。",
  "你钓上来一只靴子，靴子里有一封信，信上写着：再钓一会儿。",
  "你钓上来一条鱼，鱼说：放我回去，我带你找沉船。",
  "你钓上来一个附魔弓，附魔是：力量 I，失望 III。",
  "你钓上来一碗河豚汤，喝完看见了末影龙。",
  "你钓上来一把命名牌，名字叫：下一个更好。",
  "你钓上来一个头颅，头颅说：别钓了。",
  "你钓上来一个音乐唱片，播放的是：服务器已关闭。",
  "你钓上来一个命令方块，里面写着：/kill @e[type=player]。",
  "你建了一座城堡，苦力怕说：我帮你装修。",
  "你建了一座塔，塔顶有一只鸡。",
  "你建了一座桥，桥下是虚空。",
  "你建了一座房子，门朝岩浆。",
  "你建了一座农场，作物全跑了。",
  "你建了一座矿井，矿井里全是水。",
  "你建了一座图书馆，书全是空白的。",
  "你建了一座教堂，村民在里面交易。",
  "你建了一座雕像，雕像长得像你，但更快乐。",
  "你建了一座城，城里只有你。",
  "红石机器在响，邻居在骂。",
  "你做了个自动门，门把你夹了。",
  "你做了个自动农场，农场自动消失了。",
  "你做了个自动熔炉，熔炉烧了你的房子。",
  "你做了个自动分类，分类把你分到了垃圾桶。",
  "你做了个自动电梯，电梯把你送到了虚空。",
  "你做了个自动炮塔，炮塔先打了你。",
  "你做了个自动刷石机，刷出了你的焦虑。",
  "你做了个自动村民繁殖机，村民开始繁殖机器。",
  "你做了个自动一切，然后你没事干了。",
  "苦力怕：嘶——",
  "骷髅：咻——",
  "蜘蛛：嘶嘶——",
  "末影人：……",
  "僵尸：呃——",
  "溺尸：咕噜咕噜——",
  "女巫：嘿嘿嘿——",
  "凋灵：轰——",
  "末影龙：吼——",
  "鸡：咯咯咯——",
  "牛：哞——",
  "羊：咩——",
  "猪：哼——",
  "狼：汪——",
  "猫：喵——",
  "豹猫：喵呜——",
  "狐狸：嘤——",
  "蜜蜂：嗡嗡嗡——",
  "熊猫：嗯——",
  "海豚：叽叽叽——",
  "A：你在干嘛？B：我在等回声。A：回声呢？B：在等我们。",
  "A：栖云怎么走？B：先左转，再右转，然后迷路。",
  "A：有钻石吗？B：有，在梦里。",
  "A：你为什么不睡？B：因为红石还在响。",
  "A：你为什么不玩？B：因为我在等服务器重启。",
  "A：你为什么不说话？B：因为我在回声洞。",
  "A：你为什么不挖矿？B：因为矿在挖我。",
  "A：你为什么不钓鱼？B：因为鱼在钓我。",
  "A：你为什么不建房子？B：因为房子在建我。",
  "A：你为什么不走？B：因为我在等一个方块。",
  "凌晨三点，红石还在响，你还在想：再挖一格。",
  "凌晨四点，你终于睡了，梦里全是苦力怕。",
  "凌晨五点，服务器重启了，你的梦也重启了。",
  "凌晨六点，鸡叫了，你以为是闹钟。",
  "早上七点，你醒了，背包空了。",
  "早上八点，你上线了，世界变了。",
  "早上九点，你发现你昨天建的房子没了。",
  "早上十点，你发现是你自己拆的。",
  "早上十一点，你决定重新开始。",
  "中午十二点，你还在出生点。",
  "愿你的钻石永远在下一格。",
  "愿你的苦力怕永远在远处。",
  "愿你的红石永远不炸。",
  "愿你的村民永远不涨价。",
  "愿你的末影人永远不生气。",
  "愿你的末影龙永远不刷新。",
  "愿你的背包永远有空格。",
  "愿你的床永远不炸。",
  "愿你的重生点永远安全。",
  "愿你的栖云永远不卡。",
  "愿你的钻石变成燧石。",
  "愿你的苦力怕永远在你身后。",
  "愿你的红石永远差一格。",
  "愿你的村民永远缺货。",
  "愿你的末影人永远在你床上。",
  "愿你的末影龙永远在回血。",
  "愿你的背包永远差一格。",
  "愿你的床永远在岩浆边。",
  "愿你的重生点永远在虚空。",
  "愿你的栖云永远在维护。",
  "你站在山顶，看云海翻涌，然后掉下去了。",
  "你站在矿洞，看岩浆翻涌，然后掉下去了。",
  "你站在末地，看虚空翻涌，然后掉下去了。",
  "你站在主城，看人群翻涌，然后卡出去了。",
  "你站在床上，看天花板翻涌，然后睡着了。",
  "你站在船里，看海洋翻涌，然后船碎了。",
  "你站在矿车里，看轨道翻涌，然后脱轨了。",
  "你站在传送门里，看紫光翻涌，然后迷路了。",
  "你站在命令方块前，看代码翻涌，然后世界没了。",
  "你站在回声洞前，看文字翻涌，然后你笑了。",
  "你挖到了世界边界，边界说：回去。",
  "你走到了地图尽头，地图说：再买一张。",
  "你飞到了建筑高度上限，天空说：别飞了。",
  "你掉到了虚空底部，虚空说：欢迎。",
  "你找到了回声洞的尽头，尽头说：没有尽头。",
  "你读完了所有回声，回声说：再读一遍。",
  "你关掉了游戏，游戏说：明天见。",
  "你关掉了电脑，电脑说：晚安。",
  "你躺到了床上，床说：别炸我。",
  "你闭上了眼睛，世界说：栖云还在。",
  "你不是在玩栖云，你是在被栖云玩。",
  "你不是在挖矿，你是在挖自己。",
  "你不是在钓鱼，你是在钓时间。",
  "你不是在建房子，你是在建回忆。",
  "你不是在跑图，你是在跑人生。",
  "你不是在打怪，你是在打命运。",
  "你不是在交易，你是在交换孤独。",
  "你不是在挂机，你是在挂念。",
  "你不是在离线，你是在离开。",
  "你不是在回声洞，你是在回声中。",
  "你说的每一句话，都会被山谷记住。",
  "但山谷很忙，不一定回你。",
  "回声洞没有底，就像你的背包。",
  "但背包可以整理，回声不行。",
  "愿你在栖云，找到属于你的那一格。",
  "哪怕那一格是岩浆。",
  "晚安，挖矿人。",
  "晚安，钓鱼人。",
  "晚安，建筑人。",
  "晚安，红石人。",
  "晚安，挂机人。",
  "晚安，回声。",
  "晚安，栖云。",
  "晚安，你。",
  "明天还要开荒。",
  "别忘了带床。",
  "别忘了带水。",
  "别忘了带食物。",
  "别忘了带火把。",
  "别忘了带自己。",
  "「你知道吗？」 我不知道",
  "「你知道吗？」 栖云服务器有很多彩蛋……"
];

const echoBtn = document.getElementById("echoCave");
if (echoBtn) {
  echoBtn.addEventListener("click", () => {
    const msg = echoMessages[Math.floor(Math.random() * echoMessages.length)];
    typewriterToast(msg);
  });
}

// ============ 千万别点（真）：随机恶作剧 ============
const neverClickRealBtn = document.getElementById("neverClickRealBtn");

if (neverClickRealBtn) {
  neverClickRealBtn.addEventListener("click", () => {
    const r = Math.random();
    let roll;
    if (r < 0.5) roll = 1;
    else if (r < 0.7) roll = 0;
    else if (r < 0.85) roll = 2;
    else roll = 3;

    document.body.style.zoom = "";
    document.body.style.transform = "";
    document.body.style.transition = "";
    document.body.style.animation = "";

    document.querySelectorAll("body *").forEach(el => {
      el.style.visibility = "";
      el.style.color = "";
    });

    if (roll === 1) {
      showToast("转起来咯~");
      const style = document.createElement("style");
      style.id = "spinStyle";
      style.textContent = `
        @keyframes spinForever {
          0%   { transform: rotate(0deg); }
          50%  { transform: rotate(3600deg); }
          100% { transform: rotate(0deg); }
        }
        body {
          animation: spinForever 15s linear infinite;
          transform-origin: center center;
        }
      `;
      document.head.appendChild(style);
    } else if (roll === 0) {
      showToast("缩！");
      document.body.style.transition = "transform 3s ease-in-out";
      document.body.style.transformOrigin = "center center";
      requestAnimationFrame(() => {
        document.body.style.transform = "scale(0.1)";
      });
    } else if (roll === 2) {
      showToast("虚晃一枪");
    } else {
      showToast("凭你的记忆来操作吧！");
      const textSelectors = "h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, .stat-num, .stat-label, .server-ip, .rule-item p, .rule-item h3, .admin-name, .admin-role, .admin-desc, .blog-author, .blog-date, .blog-content h2, .blog-content p, .faq-question, .faq-answer, .toast-text, .copy-btn, .nav-logo, .nav-links a, .btn, .pcl-btn";
      document.querySelectorAll(textSelectors).forEach(el => {
        el.style.color = "transparent";
      });
      const toastEl = document.getElementById("toast");
      if (toastEl) {
        const toastText = toastEl.querySelector(".toast-text");
        if (toastText) toastText.style.color = "";
      }
    }
  });
}

// ============ 追逐战 ============
const chaseBtn = document.getElementById("chaseBtn");
const surrenderBtn = document.getElementById("surrenderBtn");

if (chaseBtn) {
  let isRunning = false;
  let tauntTimer = null;
  let idleTimer = null;
  let isDead = false;

  const taunts = [
    "来抓我呀~",
    "你抓不到我~",
    "嘿嘿，跑得快！",
    "再快一点嘛~",
    "就这？就这？",
    "你手速不行啊~",
    "追不到追不到~",
    "菜就多练！"
  ];

  const endChase = () => {
    if (!isRunning) return;
    isRunning = false;
    if (tauntTimer) {
      clearInterval(tauntTimer);
      tauntTimer = null;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    const placeholder = document.getElementById("chasePlaceholder");
    if (placeholder) placeholder.remove();

    chaseBtn.classList.remove("chase-running");
    chaseBtn.style.left = "";
    chaseBtn.style.top = "";
    chaseBtn.style.width = "";
    if (surrenderBtn) surrenderBtn.classList.remove("show");
    showToast("点我干啥？闲着没事干去栖云玩啊！");
    restartIdle();
  };

  const stopForever = () => {
    if (tauntTimer) {
      clearInterval(tauntTimer);
      tauntTimer = null;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    const placeholder = document.getElementById("chasePlaceholder");
    if (placeholder) placeholder.remove();

    chaseBtn.classList.remove("chase-running");
    chaseBtn.style.left = "";
    chaseBtn.style.top = "";
    chaseBtn.style.width = "";
    if (surrenderBtn) surrenderBtn.classList.remove("show");
    isRunning = false;
    isDead = true;
    showToast("好吧，不理我");
  };

  const jumpAway = () => {
    const maxX = window.innerWidth - chaseBtn.offsetWidth - 20;
    const maxY = window.innerHeight - chaseBtn.offsetHeight - 20;
    chaseBtn.style.left = (Math.random() * maxX + 10) + "px";
    chaseBtn.style.top = (Math.random() * maxY + 10) + "px";
  };

  const startChase = () => {
    if (isRunning || isDead) return;
    isRunning = true;

    const placeholder = document.createElement("span");
    placeholder.id = "chasePlaceholder";
    placeholder.style.display = "inline-block";
    placeholder.style.width = chaseBtn.offsetWidth + "px";
    placeholder.style.height = chaseBtn.offsetHeight + "px";
    chaseBtn.parentNode.insertBefore(placeholder, chaseBtn);

    chaseBtn.classList.add("chase-running");

    const rect = chaseBtn.getBoundingClientRect();
    chaseBtn.style.left = rect.left + "px";
    chaseBtn.style.top = rect.top + "px";
    chaseBtn.style.width = rect.width + "px";

    if (surrenderBtn) surrenderBtn.classList.add("show");

    let idx = 0;
    showToast(taunts[0]);
    tauntTimer = setInterval(() => {
      idx++;
      showToast(taunts[idx % taunts.length]);
    }, 1500);

    setTimeout(jumpAway, 50);
  };

  const restartIdle = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (isDead) return;
      stopForever();
    }, 10000);
  };

  document.addEventListener("mousemove", (e) => {
    if (isDead) return;
    const rect = chaseBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 120) {
      if (!isRunning) startChase();
      jumpAway();
      restartIdle();
    }
  });

  document.addEventListener("click", (e) => {
    if (isDead) return;
    if (chaseBtn === e.target || chaseBtn.contains(e.target)) return;
    if (surrenderBtn && (surrenderBtn === e.target || surrenderBtn.contains(e.target))) return;
    const isButton = e.target.closest("button, a, .btn, .pcl-btn, .copy-btn, .faq-question, .player-name, .nav-links a");
    if (isButton && isRunning) {
      stopForever();
    }
  });

  chaseBtn.addEventListener("click", () => {
    if (isRunning) endChase();
  });

  if (surrenderBtn) {
    surrenderBtn.addEventListener("click", endChase);
  }

  restartIdle();
}

// ============ 下载整合包 ============
const downloadPack = document.getElementById("downloadPack");
if (downloadPack) {
  downloadPack.addEventListener("click", () => {
    showToast("下载中，请稍等……");
  });
}

// ============ 首屏背景轮播 ============
const heroBgImgs = document.querySelectorAll(".hero-bg-img");
if (heroBgImgs.length > 0) {
  let bgIndex = 0;
  heroBgImgs[0].classList.add("active");

  setInterval(() => {
    heroBgImgs[bgIndex].classList.remove("active");
    bgIndex = (bgIndex + 1) % heroBgImgs.length;
    heroBgImgs[bgIndex].classList.add("active");
  }, 5000);
}

// ============ 向下滚动箭头 ============
const scrollDown = document.getElementById("scrollDown");
if (scrollDown) {
  scrollDown.addEventListener("click", () => {
    const stats = document.querySelector(".stats");
    if (stats) {
      stats.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ============ 阅读进度条 ============
const readProgress = document.getElementById("readProgress");
if (readProgress) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    readProgress.style.width = percent + "%";
  });
}

// ============ 快速跳转 + 高亮当前步骤 ============
const jumpButtons = document.querySelectorAll(".quick-jump button");
if (jumpButtons.length > 0) {
  jumpButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-jump");
      const target = document.getElementById(targetId);
      if (target) {
        const top = target.offsetTop - 100;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  // 滚动时高亮当前步骤
  const steps = document.querySelectorAll(".guide-step");
  window.addEventListener("scroll", () => {
    let currentStep = "";
    steps.forEach(step => {
      const top = step.offsetTop - 200;
      if (window.scrollY >= top) currentStep = step.getAttribute("id");
    });
    jumpButtons.forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-jump") === currentStep) {
        btn.classList.add("active");
      }
    });
  });
}

// ============ 命令大全 ============
const commandList = document.getElementById("commandList");
if (commandList) {
  // 命令数据，直接写这里
  const commandsData = [
    // ===== 账号 =====
    "注册账号|/reg 密码 重复密码|注册服务器账号。请注意：一定要牢记密码，否则可能丢失所有物品！",
    "登录服务器|/login 密码|登录服务器，请确保你已经注册了账号",

    // ===== 家 =====
    "设置家|/sethome 家名字|创建一个独属于您的传送点，适合在野外游荡时快速返回基地",
    "传送到家|/home 家名字|传送到你设置的传送点，请保证这个传送点存在",
    "删除家|/delhome 家名字|删除设置的传送点，请注意：此操作不可撤销！",
    "查看所有家|/homes|查看你已经设置的所有传送点",
    "回出生点|/spawn|传送回服务器出生点",

    // ===== 传送 =====
    "请求传送|/tpa 玩家名|向某位玩家请求传送到他身边",
    "请求对方来|/tpahere 玩家名|请求某位玩家传送到你身边",
    "接受传送|/tpaccept|同意对方的传送请求",
    "拒绝传送|/tpdeny|拒绝对方的传送请求",
    "返回上次位置|/back|回到你上一次死亡或传送前的位置",
    "传送到地表|/top|传送到你当前所在位置的最高点",
    "查看坐标|/whereami|显示你现在所在的坐标",

    // ===== 经济 =====
    "查看余额|/balance|查看自己有多少金币",
    "转账|/pay 玩家名 金额|给其他玩家转账",
    "金币排行榜|/baltop|查看服务器金币排行榜",
    "查看物品价值|/worth|查看手里物品能卖多少钱",
    "出售手中物品|/sell|出售你手里拿的物品",
    "出售背包所有|/sell all|出售背包里所有可出售的物品",

    // ===== 商店 =====
    "打开商店|/shop|打开服务器商店，买卖物品",
    "创建商店|/qs create 价格|把手里拿的物品创建成商店（需要容器）",
    "查看商店信息|/qs info|查看你面前商店的详细信息",
    "查找商店|/qs find 物品名|查找某物品最便宜的商店",

    // ===== 领地 =====
    "创建领地|/rg create 区域名|创建一块属于自己的领地（需要 WorldEdit 选区）",
    "添加领地成员|/rg addmember 区域名 玩家名|允许某位玩家在你的领地里活动",
    "移除领地成员|/rg removemember 区域名 玩家名|取消某位玩家的领地权限",
    "查看领地信息|/rg info 区域名|查看某块领地的详细信息",
    "查看领地列表|/rg list|查看你拥有的所有领地",

    // ===== 音乐 =====
    "点歌|/music search 音乐源 歌曲名|独属于你的休闲时光！如果无法听见音乐，请确认客户端已安装模组“zmusic”任意版本！",
    "停止播放音乐|/music clear|不想听了，或者想换个听，此命令能满足你的需求",

    // ===== 聊天 =====
    "私聊|/msg 玩家名 内容|给某位玩家发私聊消息（也可用 /tell、/w）",
    "回复私聊|/r 内容|回复上一条私聊",
    "显示消息|/me 内容|显示一条属于你自己的消息（比如动作描述）",
    "屏蔽私聊|/msgtoggle|开启或关闭接收私聊消息",
    "忽略玩家|/ignore 玩家名|屏蔽某位玩家的所有消息",
    "查看在线玩家|/list|查看当前服务器在线玩家",
    "查看附近玩家|/near|查看你附近有哪些玩家",

    // ===== 邮件 =====
    "发送邮件|/mail send 玩家名 内容|给不在线的玩家留一条邮件",
    "查看邮件|/mail read|查看你收到的邮件",
    "清空邮件|/mail clear|清空你的所有邮件",

    // ===== 物品/工具 =====
    "打开垃圾桶|/trash|打开一个便携垃圾桶，丢弃不要的物品",
    "打开工作台|/craft|随时随地打开一个工作台",
    "打开末影箱|/enderchest|随时随地打开你的末影箱",
    "查看合成配方|/recipe 物品名|查询某个物品的合成方式",
    "查看手中物品信息|/iteminfo|查看手里物品的详细数据",

    // ===== 服务器信息 =====
    "打开服务器菜单|/menu|打开栖云服务器菜单，快速传送到商店、主城、生存区等地",
    "查看服务器规则|/rules|查看栖云服务器的详细规则",
    "查看公告|/motd|查看服务器每日公告",
    "查看帮助|/help|查看服务器帮助菜单",
    "查看玩家信息|/seen 玩家名|查看某位玩家最后一次在线的时间",
    "查看在线时间|/playtime|查看你在本服务器的累计游戏时长",
    "查看延迟|/ping|查看你和服务器之间的网络延迟",
    "查看服务器TPS|/tps|查看服务器当前运行流畅度",
    "查看版本信息|/viaversion|查看服务器支持的版本范围",
    "向管理员求助|/helpop 内容|向在线管理员发送求助消息",

    // ===== 原版基础 =====
    "触发计分板|/trigger 计分板 值|触发某个计分板（需要服务器设置）",
    "自杀|/suicide|快速结束自己的生命（不消耗装备耐久）"
  ];

  let html = "";
  commandsData.forEach(line => {
    const parts = line.split("|");
    if (parts.length < 3) return;
    const name = parts[0].trim();
    const cmd = parts[1].trim();
    const desc = parts[2].trim();
    const keywords = (name + " " + cmd + " " + desc).toLowerCase();
    html += `
      <div class="command-item" data-keywords="${keywords}">
        <span class="cmd-name">${name}</span>
        <code>${cmd}</code>
        <span class="cmd-desc">${desc}</span>
      </div>
    `;
  });
  commandList.innerHTML = html;

  // 搜索
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();
      document.querySelectorAll(".command-item").forEach(item => {
        const k = item.getAttribute("data-keywords") || "";
        if (keyword === "" || k.includes(keyword)) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  }
}