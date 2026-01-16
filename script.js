// ========== ELEMENTS ==========
const title = document.getElementById("title");
const message = document.getElementById("message");
const heartsBox = document.querySelector(".hearts");
const starsBox = document.querySelector(".stars");
const overlay = document.getElementById("startOverlay");
const music = document.getElementById("bgm");

// ========== TEXT ==========
const titleText = "Happy Birthday";
const msgText =
  "May your special day be filled with warm smiles, sweet moments, and beautiful memories that stay with you always.";

let started = false;

// ========== TYPEWRITER ==========
function typeText(el, text) {
  el.textContent = "";
  el.style.opacity = 1;
  let i = 0;

  function type() {
    el.textContent += text[i++];
    if (i < text.length) {
      const delay = 35 + Math.random() * 45;
      setTimeout(type, delay);
    }
  }
  type();
}

// ========== STARS ==========
function createStars() {
  for (let i = 0; i < 140; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 2 + "s";
    starsBox.appendChild(s);
  }
}

// ========== HEARTS ==========
function spawnHeart(startRandomHeight = false) {
  const h = document.createElement("div");
  h.className = "heart";
  h.style.left = Math.random() * 100 + "vw";
  h.style.bottom = startRandomHeight ? Math.random() * 100 + "vh" : "-20px";
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), 22000);
}

// ========== SHOOTING STARS ==========
let starActive = false;

function createShootingStar() {
  if (starActive) return;

  starActive = true;
  const star = document.createElement("div");
  star.className = "shooting-star";

  const angle = -20 - Math.random() * 20;
  star.style.setProperty("--angle", `${angle}deg`);
  star.style.top = Math.random() * 200 + "px";

  document.body.appendChild(star);

  setTimeout(() => {
    star.remove();
    starActive = false;
  }, 1600);
}

// ========== SCENE START ==========
function startScene() {
  createStars();

  for (let i = 0; i < 40; i++) spawnHeart(true);
  setInterval(() => spawnHeart(false), 180);

  setTimeout(() => typeText(title, titleText), 1000);
  setTimeout(() => typeText(message, msgText), 3000);

  function starLoop() {
    createShootingStar();
    const next = 5000 + Math.random() * 5000;
    setTimeout(starLoop, next);
  }
  starLoop();

  startAgeCounter();
}

// ========== MUSIC + OVERLAY ==========
overlay.addEventListener("click", () => {
  function startApp() {
  if (started) return;
  started = true;

  // Force audio unlock for mobile
  music.muted = true;
  music.play().then(() => {
    music.muted = false;
  }).catch(() => {});

  let v = 0;
  const fade = setInterval(() => {
    v += 0.01;
    music.volume = Math.min(v, 0.5);
    if (v >= 0.5) clearInterval(fade);
  }, 50);

  overlay.style.opacity = 0;
  overlay.style.pointerEvents = "none";

  setTimeout(() => overlay.remove(), 400);

  startScene();
}

// Mobile-safe listeners
overlay.addEventListener("pointerdown", startApp, { once: true });
overlay.addEventListener("touchstart", startApp, { once: true });
overlay.addEventListener("click", startApp, { once: true });
});

// ========== HEART POP ==========
function handleHeartPop(e) {
  const heart = e.target.closest(".heart");
  if (!heart) return;

  const rect = heart.getBoundingClientRect();
  popHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);

  heart.style.transition = "transform 0.15s ease, opacity 0.15s ease";
  heart.style.transform = "scale(1.5)";
  heart.style.opacity = "0";

  setTimeout(() => heart.remove(), 150);
}

document.addEventListener("pointerdown", handleHeartPop);
document.addEventListener("touchstart", handleHeartPop);

function popHeart(x, y) {
  for (let i = 0; i < 5; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.random() * 60 - 30 + "px");
    s.style.setProperty("--dy", Math.random() * 60 - 30 + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

// ========== BALLOONS ==========
const wishes = [
  "You are amazing 💖",
  "Your smile lights up the world ✨",
  "You make everything better 🌸",
  "You are truly special 💕",
  "Never stop being you 🌙"
];

function spawnBalloon() {
  const b = document.createElement("div");
  b.className = "balloon";
  b.textContent = "🎈";
  b.style.left = Math.random() * 90 + "vw";

  b.onclick = () => {
    const rect = b.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;

    b.classList.add("balloonPop");
    showWish(x, y);

    setTimeout(() => b.remove(), 400);
  };

  document.getElementById("balloonLayer").appendChild(b);
}

function showWish(x, y) {
  const w = document.createElement("div");
  w.id = "wishPopup";
  w.textContent = wishes[Math.floor(Math.random() * wishes.length)];

  w.style.left = x + "px";
  w.style.top = y + "px";

  document.body.appendChild(w);

  const card = document.getElementById("glass-card");
  card.classList.add("blurred");

  setTimeout(() => {
    w.remove();
    card.classList.remove("blurred");
  }, 2500);
}

setInterval(spawnBalloon, 3500);

// ========== AGE COUNTER ==========
const birthDate = new Date("2006-01-27T00:00:00");
let ageTimer = null;

const yearsEl = document.getElementById("years");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateAge() {
  const now = new Date();
  let diff = Math.floor((now - birthDate) / 1000);

  const years = Math.floor(diff / 31557600);
  diff %= 31557600;

  const days = Math.floor(diff / 86400);
  diff %= 86400;

  const hours = Math.floor(diff / 3600);
  diff %= 3600;

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  yearsEl.textContent = years;
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;

  const pulseBox = secondsEl.closest('.ageBox');
  if (!pulseBox) return;

  pulseBox.classList.remove('beat');
  requestAnimationFrame(() => {
    pulseBox.classList.add('beat');
    setTimeout(() => pulseBox.classList.remove('beat'), 180);
  });
}

function startAgeCounter() {
  if (ageTimer) return;

  updateAge();
  const delay = 1000 - new Date().getMilliseconds();

  setTimeout(() => {
    updateAge();
    ageTimer = setInterval(updateAge, 1000);
  }, delay);
}

// 🌌 PARALLAX (Mobile only)
if (
  window.DeviceOrientationEvent &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
) {
  window.addEventListener('deviceorientation', e => {
    const x = e.gamma || 0;
    const y = e.beta || 0;

    starsBox.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    heartsBox.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
}