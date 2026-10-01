"use strict";

/* ==============================
   PROFILE / CONTENT CONFIG
   Edit these values to customize your profile
   ============================== */

const PROFILE = {
  name: "Aiko1314",
  avatar: "assets/avatar/avatar01.jpg"
};

const SOCIAL_LINKS = {
  discord: "https://discord.com/users/1039475210203705374",
  instagram: "https://instagram.com/aaiko1314",
  spotify: "https://open.spotify.com/user/31ebwnbhkbjigkahnnm3sdv2hx2a?si=d1e0bbe484bb4531"
};

const SOCIAL_ICONS = {
  discord: "assets/icons/discord.png",
  instagram: "assets/icons/instagram.png",
  spotify: "assets/icons/spotify.png"
};

const MUSIC_CONFIG = {
  src: "assets/music/background.mp3",
  name: "do I clench my fists?",
  artist: "ridgeclub"
};

const SNOW_CONFIG = {
  image: "assets/icons/snowflake.png",
  enabled: true,
  amount: 35,
  minSize: 10,
  maxSize: 35,
  minSpeed: 5,
  maxSpeed: 12
};

const SETTINGS_KEY = "profile-settings-v2";

const $ = (id) => document.getElementById(id);

let userInteracted = false;

const state = {
  snow: true,
  rain: false,
  crt: false,
  musicMuted: false
};

/* ==============================
   SAVE / LOAD SETTINGS
   ============================== */

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.snow = typeof saved.snow === "boolean" ? saved.snow : true;
    state.rain = typeof saved.rain === "boolean" ? saved.rain : false;
    state.crt = typeof saved.crt === "boolean" ? saved.crt : false;
    state.musicMuted = typeof saved.musicMuted === "boolean" ? saved.musicMuted : false;
  } catch (e) {
    console.error("Error loading settings:", e);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving settings:", e);
  }
}

/* ==============================
   CONTENT RENDERING
   ============================== */

function setContent() {
  const name = PROFILE.name;
  $("profileName").textContent = name;
  $("enterName").textContent = name;
  $("avatar").src = PROFILE.avatar;

  // Render device list (modify these arrays to change content)
  const devices = ["MacBook Pro", "iPhone 14", "iPad Air", "AirPods Pro"];
  const interests = ["Web Development", "UI/UX Design", "Music Production", "Gaming"];
  const anime = ["Attack on Titan", "Demon Slayer", "Spy x Family", "Jujutsu Kaisen"];
  const artists = ["Taylor Swift", "Ariana Grande", "The Weeknd", "Billie Eilish"];

  renderList("devices", devices);
  renderList("interests", interests);
  renderList("favoriteAnime", anime);
  renderList("favoriteArtists", artists);

  // Set music info
  $("musicName").textContent = MUSIC_CONFIG.name;
  $("musicArtist").textContent = MUSIC_CONFIG.artist;

  // Set social links
  const discord = $("discordLink");
  const instagram = $("instagramLink");
  const spotify = $("spotifyLink");

  discord.href = SOCIAL_LINKS.discord;
  instagram.href = SOCIAL_LINKS.instagram;
  spotify.href = SOCIAL_LINKS.spotify;

  discord.querySelector("img").src = SOCIAL_ICONS.discord;
  instagram.querySelector("img").src = SOCIAL_ICONS.instagram;
  spotify.querySelector("img").src = SOCIAL_ICONS.spotify;
}

function renderList(id, values) {
  const container = $(id);
  if (!container) return;
  container.innerHTML = "";
  values.forEach((value) => {
    const p = document.createElement("p");
    p.textContent = value;
    container.appendChild(p);
  });
}

/* ==============================
   AUDIO / MUSIC PLAYER
   ============================== */

function formatTime(seconds) {
  const value = Number.isFinite(seconds) ? Number(seconds) : 0;
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

function initMusic() {
  const audio = $("bgMusic");
  audio.src = MUSIC_CONFIG.src;
  audio.loop = true;
  audio.preload = "auto";
  audio.muted = state.musicMuted;

  const updateUI = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    $("currentTime").textContent = formatTime(current);
    $("durationTime").textContent = formatTime(duration);

    if (duration > 0) {
      const progress = (current / duration) * 100;
      $("progressBar").value = progress;
    } else {
      $("progressBar").value = 0;
    }
  };

  const tryPlay = () => {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().catch(() => {
        // Autoplay blocked by browser
      });
    }
  };

  audio.addEventListener("play", () => {
    document.body.classList.add("playing");
  });

  audio.addEventListener("pause", () => {
    document.body.classList.remove("playing");
  });

  audio.addEventListener("timeupdate", updateUI);
  audio.addEventListener("loadedmetadata", updateUI);
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  $("playPauseBtn").addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    userInteracted = true;
  });

  $("progressBar").addEventListener("input", (e) => {
    const value = Number(e.target.value);
    if (!audio.duration) return;
    audio.currentTime = (value / 100) * audio.duration;
  });

  $("musicToggleBtn").addEventListener("click", () => {
    state.musicMuted = !state.musicMuted;
    audio.muted = state.musicMuted;
    $("musicToggleBtn").classList.toggle("muted", state.musicMuted);
    saveSettings();
  });

  $("musicToggleBtn").classList.toggle("muted", state.musicMuted);

  tryPlay();

  // Retry play on first user interaction
  window.addEventListener("click", () => {
    if (!userInteracted) {
      userInteracted = true;
      tryPlay();
    }
  }, { once: true });

  window.addEventListener("pointerdown", () => {
    if (!userInteracted) {
      userInteracted = true;
      tryPlay();
    }
  }, { once: true });
}

/* ==============================
   SNOW EFFECT
   Uses PNG image from assets/snow/snowflake.png
   ============================== */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function initSnow() {
  const snowLayer = $("snow-layer");
  const snowImage = new Image();
  snowImage.src = SNOW_CONFIG.image;

  snowImage.onload = () => {
    for (let i = 0; i < SNOW_CONFIG.amount; i++) {
      createSnowFlake();
    }
  };

  snowImage.onerror = () => {
    console.error("Snow image not found:", SNOW_CONFIG.image);
  };

  function createSnowFlake() {
    const snowLayer = $("snow-layer");
    const flake = document.createElement("img");
    flake.src = SNOW_CONFIG.image;
    flake.alt = "";
    flake.style.position = "absolute";
    flake.style.left = `${randomBetween(0, 100)}%`;
    flake.style.top = "-30px";
    flake.style.width = `${randomBetween(SNOW_CONFIG.minSize, SNOW_CONFIG.maxSize)}px`;
    flake.style.height = flake.style.width;
    flake.style.opacity = String(randomBetween(0.3, 1));
    flake.style.pointerEvents = "none";
    flake.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.8))";

    const duration = randomBetween(SNOW_CONFIG.minSpeed * 1000, SNOW_CONFIG.maxSpeed * 1000);
    const xDrift = randomBetween(-16, 16);

    const anim = flake.animate(
      [
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
        { transform: `translate3d(${xDrift * 0.5}px, ${window.innerHeight * 0.4}px, 0)`, opacity: 0.9 },
        { transform: `translate3d(${xDrift}px, ${window.innerHeight + 50}px, 0)`, opacity: 0 }
      ],
      {
        duration: duration,
        easing: "linear",
        fill: "forwards"
      }
    );

    anim.onfinish = () => {
      flake.remove();
      if (state.snow) {
        setTimeout(() => createSnowFlake(), 0);
      }
    };

    snowLayer.appendChild(flake);
  }
}

/* ==============================
   RAIN EFFECT
   ============================== */

function initRain() {
  const rainLayer = $("rain-layer");
  const dropCount = 20;

  rainLayer.innerHTML = "";
  for (let i = 0; i < dropCount; i++) {
    const div = document.createElement("div");
    div.className = "rain-drop";
    div.style.left = `${Math.random() * 100}%`;
    div.style.animationDelay = `${Math.random() * 2}s`;
    div.style.animationDuration = `${randomBetween(5, 10)}s`;
    div.style.opacity = `${randomBetween(0.25, 0.8)}`;
    div.style.filter = "blur(0.4px)";
    rainLayer.appendChild(div);
  }
}

/* ==============================
   CRT / OLD TV EFFECT
   ============================== */

function initCRT() {
  const crt = $("crt-layer");
  crt.classList.toggle("crt-on", state.crt);
}

/* ==============================
   UPDATE ALL EFFECTS
   ============================== */

function updateEffects() {
  const snowCheckbox = $("effectSnow");
  const rainCheckbox = $("effectRain");
  const crtCheckbox = $("effectCrt");

  snowCheckbox.checked = state.snow;
  rainCheckbox.checked = state.rain;
  crtCheckbox.checked = state.crt;

  // Show/hide snow layer
  const snowLayer = $("snow-layer");
  snowLayer.style.display = state.snow ? "block" : "none";

  // Show/hide rain layer
  const rainLayer = $("rain-layer");
  rainLayer.style.display = state.rain ? "block" : "none";

  // Show/hide CRT effect
  const crtLayer = $("crt-layer");
  crtLayer.classList.toggle("crt-on", state.crt);
}

/* ==============================
   SETTINGS PANEL BINDINGS
   ============================== */

function bindSettings() {
  const snowInput = $("effectSnow");
  const rainInput = $("effectRain");
  const crtInput = $("effectCrt");

  snowInput.addEventListener("change", () => {
    state.snow = snowInput.checked;
    saveSettings();
    updateEffects();
  });

  rainInput.addEventListener("change", () => {
    state.rain = rainInput.checked;
    saveSettings();
    updateEffects();
  });

  crtInput.addEventListener("change", () => {
    state.crt = crtInput.checked;
    saveSettings();
    updateEffects();
  });

  // Settings panel open/close
  $("fab").addEventListener("click", () => {
    $("panel").classList.add("open");
    $("scrim").classList.add("open");
    $("panel").setAttribute("aria-expanded", "true");
  });

  $("closePanelBtn").addEventListener("click", () => {
    $("panel").classList.remove("open");
    $("scrim").classList.remove("open");
  });

  $("scrim").addEventListener("click", () => {
    $("panel").classList.remove("open");
    $("scrim").classList.remove("open");
  });

  // Enter button
  $("enterBtn").addEventListener("click", () => {
    document.body.classList.add("ready");
    $("enterBtn").classList.add("hide");
    $("page").style.opacity = "1";
    $("page").style.visibility = "visible";
  });
}

/* ==============================
   INITIALIZATION
   ============================== */

function init() {
  loadSettings();
  setContent();
  bindSettings();
  updateEffects();
  initSnow();
  initRain();
  initCRT();
  initMusic();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
