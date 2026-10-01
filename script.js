"use strict";

/* =====================================================
   CONFIG — 所有個人資料都改這裡
   所有路徑請使用相對路徑（例如 assets/avatar.png）
   ===================================================== */
const CONFIG = {
    username: "YourName",
    displayName: "Your Name",
    bio: "Your personal bio",
    avatar: "assets/avatar.png",
    background: "assets/background.jpg",
    
    social: {
        github: "#",
        discord: "#",
        youtube: "#"
    },

    // ---- 以下為額外設定 ----
    theme: "purple",                  // purple | blue | pink | cyan | green
    status: "Available for chat",
    statusType: "online",             // online | idle | dnd | offline
    location: "Taipei, Taiwan",
    joined: "August 19, 2023",
    badges: [
        { icon: "💎", label: "Premium" },
        { icon: "🔥", label: "Active" },
        { icon: "⭐", label: "Favorite" }
    ],

    // 新增：四個玻璃卡片的內容
    devices: [
        "Apple MacBook Pro",
        "iPad Air",
        "iPhone 14 Pro",
        "AirPods Pro"
    ],
    interests: [
        "Web Development",
        "UI/UX Design",
        "Coding",
        "Music Production"
    ],
    favoriteAnime: [
        "Attack on Titan",
        "Demon Slayer",
        "Jujutsu Kaisen",
        "One Piece"
    ],
    favoriteArtists: [
        "The Weeknd",
        "Dua Lipa",
        "Billie Eilish",
        "Harry Styles"
    ],

    // Spotify 設定 - 直接修改這裡的 URL 和名稱
    spotifyUrl: "https://open.spotify.com/embed/track/6rqhFgbbKwnb9MLmUQDvDm", // 改成你的 Spotify embed URL
    musicName: "Your Music Title",

    // 背景圖片 URL
    backgroundUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
};

/* ---------- Settings (localStorage) ---------- */
const THEMES = { purple: "#a855f7", blue: "#3b82f6", pink: "#ec4899", cyan: "#22d3ee", green: "#34d399" };
const KEY = "profile-settings-v2";
const DEF = { 
    theme: CONFIG.theme in THEMES ? CONFIG.theme : "purple", 
    effect: "none",
    volume: 0.5, 
    muted: false 
};

const $ = id => document.getElementById(id);
const root = document.documentElement;
const num = (v, min, max, d) => { v = Number(v); return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d; };

function load() {
    try {
        const o = JSON.parse(localStorage.getItem(KEY)) || {};
        return {
            theme: o.theme in THEMES ? o.theme : DEF.theme,
            effect: ["none", "rain", "snow", "crt"].includes(o.effect) ? o.effect : DEF.effect,
            volume: num(o.volume, 0, 1, DEF.volume),
            muted: !!o.muted
        };
    } catch { return { ...DEF }; }
}

let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } };

/* ---------- Helpers ---------- */
function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
}

function icon(id) {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg"), u = document.createElementNS(ns, "use");
    s.setAttribute("class", "ic");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
}

/* ---------- Background Effects ---------- */
let currentEffect = null;

function clearEffect() {
    if (currentEffect) {
        currentEffect.remove();
        currentEffect = null;
    }
}

function createRainEffect() {
    clearEffect();
    const container = el("div", "rain-effect");
    
    for (let i = 0; i < 50; i++) {
        const drop = el("div", "rain-drop");
        drop.style.left = Math.random() * 100 + "%";
        drop.style.animationDuration = (2 + Math.random() * 1) + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(drop);
    }
    
    document.body.appendChild(container);
    currentEffect = container;
}

function createSnowEffect() {
    clearEffect();
    const container = el("div", "snow-effect");
    
    for (let i = 0; i < 40; i++) {
        const flake = el("div", "snowflake");
        flake.style.left = Math.random() * 100 + "%";
        flake.style.animationDuration = (8 + Math.random() * 4) + "s";
        flake.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(flake);
    }
    
    document.body.appendChild(container);
    currentEffect = container;
}

function createCRTEffect() {
    clearEffect();
    const container = el("div", "crt-effect");
    document.body.appendChild(container);
    currentEffect = container;
}

function applyEffect(effect) {
    clearEffect();
    if (effect === "rain") createRainEffect();
    else if (effect === "snow") createSnowEffect();
    else if (effect === "crt") createCRTEffect();
}

/* ---------- Render content ---------- */
function render() {
    document.title = `${CONFIG.displayName} | ${CONFIG.username}`;
    $("name").textContent = $("enterName").textContent = CONFIG.displayName;
    $("user").textContent = "@" + CONFIG.username;
    $("musicTitle").textContent = CONFIG.musicName;

    const av = $("avatar");
    av.alt = CONFIG.displayName;
    av.onerror = () => { av.onerror = null; av.src = fallbackAvatar(); };
    av.src = CONFIG.avatar;

    // 渲染四個卡片內容
    renderCardContent("devices", CONFIG.devices);
    renderCardContent("interests", CONFIG.interests);
    renderCardContent("favoriteAnime", CONFIG.favoriteAnime);
    renderCardContent("favoriteArtists", CONFIG.favoriteArtists);

    // 渲染 Spotify 播放器
    renderSpotifyPlayer();
}

function renderCardContent(elementId, items) {
    const container = $(elementId);
    if (!container) return;
    
    container.innerHTML = "";
    items.forEach(item => {
        const p = el("p", "", item);
        container.appendChild(p);
    });
}

function fallbackAvatar() {
    const c = ([...CONFIG.displayName][0] || "?").replace(/[<>&"']/g, "");
    return "data:image/svg+xml," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#4c1d95"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-size="46" fill="#fff" font-weight="700" font-family="Outfit, system-ui" text-anchor="middle">${c}</text></svg>`
    );
}

function renderSpotifyPlayer() {
    const container = $("spotifyPlayer");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (CONFIG.spotifyUrl) {
        const iframe = document.createElement("iframe");
        iframe.src = CONFIG.spotifyUrl + "?utm_source=generator";
        iframe.width = "100%";
        iframe.height = "352";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = "";
        iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        iframe.loading = "lazy";
        container.appendChild(iframe);
    } else {
        container.innerHTML = "<p class='muted' style='text-align:center; padding:2rem 0;'>設定 CONFIG.spotifyUrl 以顯示音樂播放器</p>";
    }
}

/* ---------- Theme ---------- */
function apply() {
    root.dataset.theme = S.theme;
    document.querySelectorAll(".sw").forEach(b => b.setAttribute("aria-checked", b.title === S.theme));
    applyEffect(S.effect);
}

function setBg() {
    const src = CONFIG.backgroundUrl;
    if (!src) { root.style.setProperty("--bg", "none"); return; }
    const img = new Image();
    img.onload = () => root.style.setProperty("--bg", `url("${src.replace(/"/g, "%22")}")`);
    img.onerror = () => {
        root.style.setProperty("--bg", "none");
    };
    img.src = src;
}

/* ---------- Settings Panel ---------- */
function initSettings() {
    // 背景效果按鈕
    const effectButtons = document.querySelectorAll(".btn[data-effect]");
    effectButtons.forEach(btn => {
        btn.onclick = () => {
            S.effect = btn.dataset.effect;
            applyEffect(S.effect);
            save();
            updateEffectButtons();
        };
    });
    updateEffectButtons();

    // 重置按鈕
    $("reset").onclick = () => {
        S = { ...DEF };
        try { localStorage.removeItem(KEY); } catch { }
        apply();
        setBg();
        updateEffectButtons();
    };

    const panel = $("panel");
    const open = o => {
        panel.classList.toggle("open", o);
        $("scrim").classList.toggle("open", o);
        panel.inert = !o;
        $("page").inert = o;
        $("fab").setAttribute("aria-expanded", o);
        (o ? $("close") : $("fab")).focus();
    };
    $("fab").onclick = () => open(true);
    $("close").onclick = $("scrim").onclick = () => open(false);
    addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("open")) open(false); });
}

function updateEffectButtons() {
    document.querySelectorAll(".btn[data-effect]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.effect === S.effect);
    });
}

/* ---------- Volume Control ---------- */
function initVolumeToggle() {
    const volumeBtn = $("volumeToggle");
    if (!volumeBtn) return;

    volumeBtn.onclick = (e) => {
        e.preventDefault();
        S.muted = !S.muted;
        updateVolumeButton();
        save();
    };

    updateVolumeButton();
}

function updateVolumeButton() {
    const volumeBtn = $("volumeToggle");
    if (!volumeBtn) return;
    
    volumeBtn.classList.toggle("muted", S.muted);
    const iconId = S.muted ? "i-mute" : "i-vol";
    volumeBtn.replaceChildren(icon(iconId));
}

/* ---------- Enter screen ---------- */
function initEnter() {
    $("enter").onclick = () => {
        document.body.classList.replace("locked", "ready");
        $("enter").classList.add("hide");
        $("enter").inert = true;
        $("page").inert = false;
        $("fab").inert = false;
    };
}

/* ---------- Init ---------- */
render();
initSettings();
apply();
setBg();
initVolumeToggle();
initEnter();
