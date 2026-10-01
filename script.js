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
    music: "assets/music.mp3",
    social: {
        github: "#",
        discord: "#",
        youtube: "#"
        // 也可加入：email: "you@example.com"，其他名稱會使用通用連結圖示
    },

    // ---- 以下為額外設定 ----
    theme: "purple",                  // purple | blue | pink | cyan | green
    musicTitle: "Background music",
    status: "Available for chat",
    statusType: "online",             // online | idle | dnd | offline
    location: "Taipei, Taiwan",
    joined: "August 19, 2023",        // 留空 "" 則不顯示
    badges: [
        { icon: "💎", label: "Premium" },
        { icon: "🔥", label: "Active" },
        { icon: "⭐", label: "Favorite" }
    ],
    about: [
        "Hi, I'm Your Name. Write a few sentences about yourself here.",
        "Tell visitors what you love building, learning, or playing."
    ],
    skills: [
        { name: "HTML & CSS", level: 90 },
        { name: "JavaScript", level: 80 },
        { name: "Design", level: 70 }
    ],
    projects: [
        { name: "Project One", description: "A short description of what this project does.", url: "#", tags: ["HTML", "CSS"] },
        { name: "Project Two", description: "Another project worth showing off.", url: "#", tags: ["JavaScript"] },
        { name: "Project Three", description: "Something you are currently working on.", url: "#", tags: ["Idea"] }
    ],
    footer: "Made with HTML, CSS & JavaScript"
};

/* ---------- Settings (localStorage) ---------- */
const THEMES = { purple: "#a855f7", blue: "#3b82f6", pink: "#ec4899", cyan: "#22d3ee", green: "#34d399" };
const KEY = "profile-settings-v1";
const DEF = { theme: CONFIG.theme in THEMES ? CONFIG.theme : "purple", blur: 22, alpha: 28, dim: 35, volume: 0.5, muted: false, bg: "" };

const $ = id => document.getElementById(id);
const root = document.documentElement;
const num = (v, min, max, d) => { v = Number(v); return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d; };

function load() {
    try {
        const o = JSON.parse(localStorage.getItem(KEY)) || {};
        return {
            theme: o.theme in THEMES ? o.theme : DEF.theme,
            blur: num(o.blur, 0, 40, DEF.blur),
            alpha: num(o.alpha, 0, 60, DEF.alpha),
            dim: num(o.dim, 0, 80, DEF.dim),
            volume: num(o.volume, 0, 1, DEF.volume),
            muted: !!o.muted,
            bg: typeof o.bg === "string" ? o.bg : ""
        };
    } catch { return { ...DEF }; }
}
let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* 無痕模式或空間不足 */ } };

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
function paint(i) { i.style.setProperty("--p", ((i.value - i.min) / (i.max - i.min)) * 100 + "%"); }
function setLink(a, url) {
    let h = String(url || "#").trim();
    if (/^javascript:/i.test(h)) h = "#";
    a.href = h;
    if (/^https?:/i.test(h)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    if (h === "#") a.addEventListener("click", e => e.preventDefault());
}
function fallbackAvatar() {
    const c = ([...CONFIG.displayName][0] || "?").replace(/[<>&"']/g, "");
    return "data:image/svg+xml," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#4c1d95"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-size="46" fill="#fff" font-family="sans-serif">${c}</text></svg>`);
}

/* ---------- Render content ---------- */
const ICONS = { github: "i-github", discord: "i-discord", youtube: "i-youtube", email: "i-mail", mail: "i-mail" };

function render() {
    document.title = `${CONFIG.displayName} | ${CONFIG.username}`;
    $("name").textContent = $("enterName").textContent = CONFIG.displayName;
    $("user").textContent = "@" + CONFIG.username;
    $("statusText").textContent = CONFIG.status;
    $("statusDot").dataset.s = CONFIG.statusType;
    $("loc").textContent = CONFIG.location;
    $("joined").textContent = CONFIG.joined ? "Joined " + CONFIG.joined : "";
    $("bioGhost").textContent = CONFIG.bio;
    $("bio").setAttribute("aria-label", CONFIG.bio);
    $("track").textContent = CONFIG.musicTitle;
    $("foot").textContent = `© ${new Date().getFullYear()} ${CONFIG.displayName} · ${CONFIG.footer}`;

    const av = $("avatar");
    av.alt = CONFIG.displayName;
    av.onerror = () => { av.onerror = null; av.src = fallbackAvatar(); };
    av.src = CONFIG.avatar;

    CONFIG.badges.forEach(b => { const s = el("span", "badge", b.icon); s.title = b.label; $("badges").append(s); });

    Object.entries(CONFIG.social).forEach(([k, v]) => {
        if (!v) return;
        const a = el("a", "soc");
        let h = String(v).trim();
        if ((k === "email" || k === "mail") && h.includes("@") && !h.startsWith("mailto:")) h = "mailto:" + h;
        setLink(a, h);
        a.title = k;
        a.setAttribute("aria-label", k);
        a.append(icon(ICONS[k] || "i-link"));
        $("social").append(a);
    });

    CONFIG.about.forEach(t => $("about").append(el("p", "", t)));

    CONFIG.skills.forEach(s => {
        const row = el("div", "skill"), head = el("div", "head"), bar = el("div", "bar"), fill = el("span", "fill");
        head.append(el("span", "", s.name), el("span", "muted", s.level + "%"));
        fill.style.setProperty("--lv", num(s.level, 0, 100, 0) + "%");
        bar.append(fill);
        row.append(head, bar);
        $("skills").append(row);
    });

    CONFIG.projects.forEach(p => {
        const a = el("a", "proj"), tags = el("div", "tags");
        setLink(a, p.url);
        (p.tags || []).forEach(t => tags.append(el("span", "", t)));
        a.append(el("h3", "", p.name), el("p", "", p.description), tags);
        $("projects").append(a);
    });

    document.querySelectorAll(".card").forEach((c, i) => c.style.setProperty("--i", i));
}

/* ---------- Theme / glass / background ---------- */
function apply() {
    root.dataset.theme = S.theme;
    root.style.setProperty("--blur", S.blur + "px");
    root.style.setProperty("--alpha", S.alpha / 100);
    root.style.setProperty("--dim", S.dim / 100);
    document.querySelectorAll(".sw").forEach(b => b.setAttribute("aria-checked", b.title === S.theme));
}

function setBg() {
    const src = S.bg || CONFIG.background;
    if (!src) { root.style.setProperty("--bg", "none"); return; }
    const img = new Image();
    img.onload = () => root.style.setProperty("--bg", `url("${src.replace(/"/g, "%22")}")`);
    img.onerror = () => {
        root.style.setProperty("--bg", "none");   // 找不到圖片時使用漸層背景
        if (S.bg) { S.bg = ""; save(); $("bgNote").textContent = "Couldn't load that image. Using the default."; setBg(); }
    };
    img.src = src;
}

function sync() {
    [["blur", "blur"], ["alpha", "alpha"], ["dim", "dim"]].forEach(([id, k]) => { const i = $(id); i.value = S[k]; paint(i); });
    $("bgUrl").value = S.bg;
}

function initSettings() {
    Object.entries(THEMES).forEach(([id, c]) => {
        const b = el("button", "sw");
        b.type = "button"; b.title = id; b.style.background = c; b.style.color = c;
        b.setAttribute("role", "radio"); b.setAttribute("aria-label", id);
        b.onclick = () => { S.theme = id; apply(); save(); };
        $("themes").append(b);
    });
    ["blur", "alpha", "dim"].forEach(k => {
        const i = $(k);
        i.oninput = () => { S[k] = +i.value; paint(i); apply(); save(); };
    });
    $("bgApply").onclick = () => { S.bg = $("bgUrl").value.trim(); $("bgNote").textContent = ""; save(); setBg(); };
    $("bgReset").onclick = () => { S.bg = ""; $("bgUrl").value = ""; $("bgNote").textContent = ""; save(); setBg(); };
    $("reset").onclick = () => {
        S = { ...DEF };
        try { localStorage.removeItem(KEY); } catch { /* ignore */ }
        $("bgNote").textContent = "";
        sync(); apply(); setBg(); setVolume();
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

/* ---------- Music player ---------- */
const au = new Audio();
let seeking = false;
const fmt = t => isFinite(t) ? Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0") : "0:00";

function setVolume() {
    au.volume = S.volume;
    au.muted = S.muted;
    const v = $("vol");
    v.value = S.volume; paint(v);
    $("mute").replaceChildren(icon(S.muted || S.volume === 0 ? "i-mute" : "i-vol"));
}

function initMusic() {
    au.loop = true;
    au.preload = "metadata";
    au.onerror = () => {
        $("play").disabled = true;
        $("track").textContent = "Add assets/music.mp3 to enable music";
    };
    au.onplay = au.onpause = () => {
        const p = !au.paused;
        $("play").replaceChildren(icon(p ? "i-pause" : "i-play"));
        $("play").setAttribute("aria-label", p ? "Pause" : "Play");
        $("music").classList.toggle("on", p);
    };
    au.onloadedmetadata = () => { $("dur").textContent = fmt(au.duration); };
    au.ontimeupdate = () => {
        $("cur").textContent = fmt(au.currentTime);
        if (!seeking && au.duration) { $("seek").value = (au.currentTime / au.duration) * 1000; paint($("seek")); }
    };
    if (CONFIG.music) au.src = CONFIG.music; else au.onerror();

    $("play").onclick = () => (au.paused ? au.play().catch(() => {}) : au.pause());
    $("seek").oninput = () => { seeking = true; paint($("seek")); };
    $("seek").onchange = () => { if (au.duration) au.currentTime = ($("seek").value / 1000) * au.duration; seeking = false; };
    $("vol").oninput = () => { S.volume = +$("vol").value; if (S.volume > 0) S.muted = false; setVolume(); save(); };
    $("mute").onclick = () => { S.muted = !S.muted; setVolume(); save(); };
    setVolume();
}

/* ---------- Enter screen ---------- */
function typeBio() {
    const t = $("bioText"), chars = [...CONFIG.bio];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { t.textContent = CONFIG.bio; return; }
    let i = 0;
    (function step() {
        t.textContent = chars.slice(0, ++i).join("");
        if (i < chars.length) setTimeout(step, 55);
    })();
}

function initEnter() {
    $("page").inert = $("fab").inert = true;
    $("enter").onclick = () => {
        document.body.classList.replace("locked", "ready");
        $("enter").classList.add("hide");
        $("enter").inert = true;
        $("page").inert = $("fab").inert = false;
        typeBio();
        if (!$("play").disabled) au.play().catch(() => {});
    };
}

/* ---------- Init ---------- */
render();
initSettings();
sync();
apply();
setBg();
initMusic();
initEnter();
