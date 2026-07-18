let palette = { colors: [] };
let basePalette = { colors: [] };
let selectedMixSlots = [null, null, null];
let mixPickerBuilt = false;
let mixPickerStarsOnly = false;
let variantIndex = new Map();
let detailColor = null;
let editingColorId = null;

const STORAGE = {
  current: "our-art-studio-current", // legacy, cleared on migrate
  kits: "our-art-studio-kits-v1",
  activeKit: "our-art-studio-active-kit",
  todays: "our-art-studio-todays-palette",
  userData: "our-art-studio-user-data",
  syncPassphrase: "our-art-studio-sync-passphrase",
  lastSyncedAt: "our-art-studio-last-synced-at",
};

const SYNC_BUNDLE_VERSION = 2;
const KIT_SLOT_MAX = 36;
const KIT_SLOT_MIN = 8;

/** Home tin: 4×4 left + 2 big + 2×4 right + 10 bottom = 36 */
const HOME_TIN = { left: 16, big: 2, right: 8, bottom: 10, total: 36 };

/** Prefill from studio home kit card (confirmed Jul 2026). null = empty / missing catalog */
const HOME_DEFAULT_SLOTS = [
  "mg-104",
  "ds-15ml-hot-mulled-cider-yellow",
  null, // Winsor Newton purple — not in catalog yet
  "mg-020-burnt-sienna",
  "ds-128-prussian-green",
  "sch-923-desert-brown",
  "wn-273",
  "ds-15ml-candy-cane-red",
  null, // DS transparent green (card) — confirm later
  "rosa-747",
  "wn-tube-quin-red",
  "mb-potters-pink",
  "sch-hp-940-brilliant-red-violet",
  "sch-hp-667-raw-umber",
  "sch-482-delft",
  "mg-193-ultramarine-violet",
  "wn-745", // May Green (WNA; card 475 → catalog 745)
  "rosa-755",
  "wn-tube-winsor-blue-gs",
  "wn-tube-paynes-gray",
  "ds-237-rose-madder",
  "wn-609",
  "ds-burnt-sienna",
  "rosa-761",
  "ds-034-french-ultramarine",
  "wn-559",
  "wn-555",
  null, // DS 932 — not in catalog yet
  "ds-undersea-green",
  "sch-924-desert-green",
  "ds-174-royal-purple",
  "ds-moonglow",
  null,
  null,
  null,
  null,
];

let userData = { removed: [], added: [], overrides: {} };
let kits = [];
let activeKitId = null;
let kitFillSlotIndex = null;
let syncApiAvailable = false;
let skipNextSyncPush = false;
let syncPushTimer = null;
let localSyncRevision = 0;
let brandStories = [];
let selectedBrandId = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showLoadError(msg) {
  const status = document.getElementById("load-status");
  if (status) status.hidden = true;
  const el = document.getElementById("load-error");
  if (el) {
    el.hidden = false;
    el.textContent = msg;
  }
}

function hideLoadStatus() {
  const status = document.getElementById("load-status");
  if (status) status.hidden = true;
}

async function init() {
  try {
  const res = await fetch(`data/palette.json?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load palette (${res.status})`);
  basePalette = await res.json();
  if (!basePalette.colors?.length) throw new Error("Palette is empty");
  palette =
    typeof structuredClone === "function"
      ? structuredClone(basePalette)
      : JSON.parse(JSON.stringify(basePalette));
  loadUserData();
  applyUserChanges();

  $("#studio-name").textContent = palette.studio_name || "Our Art Studio";
  $("#studio-name-zh").textContent = palette.studio_name_zh || "";
  updatePaletteMeta();
  renderCaveats();
  buildVariantIndex();

  loadUserLists();
  loadKits();
  rebuildFilters();
  await loadBrandStories();
  await initStudioSync();
  renderTodaysPalette();
  renderPalette();
  renderKits();
  updateTabBadges();
  renderHueChips();
  bindEvents();
  registerServiceWorker();
  hideLoadStatus();
  } catch (err) {
    console.error(err);
    showLoadError(
      "Could not load the studio — the server may be stopped. Run scripts/serve.sh on your Mac, then hard-refresh (Cmd+Shift+R). " +
        err.message
    );
  }
}

function isLocalDevHost() {
  const h = location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    /^192\.168\.\d+\.\d+$/.test(h) ||
    /^10\.\d+\.\d+\.\d+$/.test(h)
  );
}

async function unregisterStaleServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.unregister()));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || isLocalDevHost()) {
    if (isLocalDevHost()) unregisterStaleServiceWorkers();
    return;
  }
  navigator.serviceWorker
    .register("./sw.js?v=70")
    .then((reg) => reg.update())
    .catch(() => {});
}

function renderCaveats() {
  const list = $("#caveats-list");
  const items = palette.caveats || [];
  if (!items.length) {
    $("#caveats-banner").hidden = true;
    return;
  }
  list.innerHTML = items.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  $("#caveats-toggle").addEventListener("click", () => {
    const btn = $("#caveats-toggle");
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    list.hidden = open;
  });
}

function updatePaletteMeta() {
  const meta = $("#palette-meta");
  if (!meta) return;
  const base = `${palette.colors.length} colors`;
  const custom = userData.added.length;
  const edited = Object.keys(userData.overrides).length;
  const bits = [base];
  if (custom) bits.push(`${custom} yours`);
  if (edited) bits.push(`${edited} edited`);
  bits.push(`updated ${palette.updated || basePalette.updated || "today"}`);
  meta.textContent = bits.join(" · ");
}

function resetFilterSelect(sel, firstLabel) {
  sel.innerHTML = `<option value="">${firstLabel}</option>`;
}

function populateBrandFilter() {
  const brands = [...new Set(palette.colors.map((c) => c.brand))].sort();
  const sel = $("#brand-filter");
  brands.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    sel.appendChild(opt);
  });
}

function populateFamilyFilter() {
  const sel = $("#family-filter");
  const families = [...new Set(palette.colors.map((c) => c.family).filter(Boolean))].sort();
  families.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    sel.appendChild(opt);
  });
  const granCount = palette.colors.filter((c) => c.granulating).length;
  if (granCount) {
    const gran = document.createElement("option");
    gran.value = "_granulating";
    gran.textContent = `✦ Granulating (${granCount})`;
    sel.appendChild(gran);
  }
  const mixCount = palette.colors.filter((c) => c.mix_star).length;
  if (mixCount) {
    const mix = document.createElement("option");
    mix.value = "_mix_star";
    mix.textContent = `◈ Mixers (${mixCount})`;
    sel.appendChild(mix);
  }
}

function rebuildFilters() {
  resetFilterSelect($("#brand-filter"), "All brands");
  resetFilterSelect($("#family-filter"), "All families");
  resetFilterSelect($("#format-filter"), "All formats");
  populateBrandFilter();
  populateFamilyFilter();
  populateFormatFilter();
  populateFamilyFormSelect();
}

/** Families present in the studio palette — for Add Color dropdown */
function populateFamilyFormSelect() {
  const sel = $("#f-family");
  if (!sel) return;
  const current = sel.value;
  const families = [
    ...new Set(
      (palette.colors || [])
        .map((c) => (c.family || "").trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));
  sel.innerHTML = '<option value="">—</option>';
  families.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    sel.appendChild(opt);
  });
  if (current && [...sel.options].some((o) => o.value === current)) {
    sel.value = current;
  }
}

/** Map free-text / legacy format strings onto the Add form dropdown */
function mapFormatForForm(format) {
  const f = (format || "").toLowerCase().trim();
  if (!f) return "";
  if (f === "sample" || f.includes("sample")) return "sample";
  if (f === "tube" || f.includes("tube")) return "tube";
  if (f === "half-pan" || f.includes("half-pan") || f.includes("half pan")) {
    return "half-pan";
  }
  if (f === "full pan" || f.includes("full pan") || f.includes("full-pan")) {
    return "full pan";
  }
  return "";
}

const FORMAT_FILTER_OPTIONS = [
  { value: "half-pan", label: "Half-pan" },
  { value: "pan", label: "Pan" },
  { value: "tube", label: "Tube" },
  { value: "sample", label: "Sample" },
  { value: "other", label: "Other" },
];

function formatCategories(c) {
  const f = (c.format || "").toLowerCase();
  const cats = new Set();
  if (!f) {
    cats.add("other");
    return cats;
  }
  if (f.includes("half-pan")) cats.add("half-pan");
  if (f.includes("full pan") || /^pan\b/.test(f) || /,\s*pan\b/.test(f)) cats.add("pan");
  if (f.includes("tube")) cats.add("tube");
  if (f.includes("sample")) cats.add("sample");
  if (!cats.size) cats.add("other");
  return cats;
}

function matchesFormatFilter(c, format) {
  if (!format) return true;
  return formatCategories(c).has(format);
}

function populateFormatFilter() {
  const sel = $("#format-filter");
  const counts = Object.fromEntries(FORMAT_FILTER_OPTIONS.map((o) => [o.value, 0]));
  palette.colors.forEach((c) => {
    formatCategories(c).forEach((cat) => {
      if (counts[cat] !== undefined) counts[cat] += 1;
    });
  });
  FORMAT_FILTER_OPTIONS.forEach((o) => {
    const n = counts[o.value];
    if (!n) return;
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = `${o.label} (${n})`;
    sel.appendChild(opt);
  });
}

const TOXICITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function toxicityLevel(c) {
  return c.toxicity || "low";
}

function toxicityLightHtml(level) {
  const lv = TOXICITY_LABELS[level] ? level : "low";
  const label = TOXICITY_LABELS[lv] || "Low";
  return `<span class="toxicity-light toxicity-${lv}" title="${label} handling concern" aria-label="${label} toxicity"></span>`;
}

function filteredColors() {
  const q = $("#search").value.trim().toLowerCase();
  const brand = $("#brand-filter").value;
  const family = $("#family-filter").value;
  const toxicity = $("#toxicity-filter")?.value || "";
  const format = $("#format-filter")?.value || "";
  const filtered = palette.colors.filter((c) => {
    if (brand && c.brand !== brand) return false;
    if (family === "_granulating") {
      if (!c.granulating) return false;
    } else if (family === "_mix_star") {
      if (!c.mix_star) return false;
    } else if (family && c.family !== family) return false;
    if (toxicity && toxicityLevel(c) !== toxicity) return false;
    if (!matchesFormatFilter(c, format)) return false;
    if (!q) return true;
    const hay = [c.name_en, c.name_zh, c.brand, c.pigment, c.code, c.notes, c.family, c.format]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
  return Mixing.sortBySpectrum(filtered);
}

function loadStoredIds(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredIds(key, ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE.userData);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    userData = {
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
      added: Array.isArray(parsed.added) ? parsed.added : [],
      overrides:
        parsed.overrides && typeof parsed.overrides === "object" ? parsed.overrides : {},
    };
  } catch {
    userData = { removed: [], added: [], overrides: {} };
  }
}

function saveUserData() {
  localStorage.setItem(STORAGE.userData, JSON.stringify(userData));
}

function mergeColorEntry(base, override) {
  if (!override) return { ...base };
  const merged = { ...base, ...override };
  if (override.mix_tips === undefined) merged.mix_tips = base.mix_tips;
  if (override.brand_traits === undefined) merged.brand_traits = base.brand_traits;
  return merged;
}

function applyUserChanges() {
  const removed = new Set(userData.removed);
  const colors = [];
  basePalette.colors.forEach((c) => {
    if (removed.has(c.id)) return;
    colors.push(mergeColorEntry(c, userData.overrides[c.id]));
  });
  userData.added.forEach((c) => {
    if (!removed.has(c.id)) colors.push({ ...c });
  });
  palette.colors = colors;
  palette.color_count = colors.length;
}

function persistPaletteChanges() {
  saveUserData();
  applyUserChanges();
  buildVariantIndex();
  updatePaletteMeta();
  rebuildFilters();
  mixPickerBuilt = false;
  loadUserLists();
  loadKits();
  renderPalette();
  renderKits();
  updateTabBadges();
  if ($("#panel-mix").classList.contains("active")) ensureMixPicker();
  if (brandStories.length) renderBrandChips();
  if (!skipNextSyncPush) scheduleSyncPush();
  skipNextSyncPush = false;
}

function buildSyncBundle() {
  localSyncRevision += 1;
  return {
    version: SYNC_BUNDLE_VERSION,
    updatedAt: Date.now(),
    revision: localSyncRevision,
    userData: {
      removed: [...userData.removed],
      added: userData.added.map((c) => ({ ...c })),
      overrides: { ...userData.overrides },
    },
    kits: kits.map((k) => ({ ...k, slots: [...k.slots] })),
    activeKitId,
  };
}

function applySyncBundle(bundle) {
  if (!bundle?.userData) return false;
  userData = {
    removed: Array.isArray(bundle.userData.removed) ? bundle.userData.removed : [],
    added: Array.isArray(bundle.userData.added) ? bundle.userData.added : [],
    overrides:
      bundle.userData.overrides && typeof bundle.userData.overrides === "object"
        ? bundle.userData.overrides
        : {},
  };
  if (Array.isArray(bundle.kits) && bundle.kits.length) {
    kits = bundle.kits.map(normalizeKit);
    activeKitId = bundle.activeKitId || kits[0]?.id || null;
    saveKits();
  }
  if (bundle.revision) localSyncRevision = Math.max(localSyncRevision, bundle.revision);
  if (bundle.updatedAt) {
    localStorage.setItem(STORAGE.lastSyncedAt, String(bundle.updatedAt));
  }
  skipNextSyncPush = true;
  persistPaletteChanges();
  return true;
}

function sha256HexBytes(bytes) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const bitLen = bytes.length * 8;
  const padLen = (bytes.length + 9) % 64 === 0 ? 0 : 64 - ((bytes.length + 9) % 64);
  const total = bytes.length + 1 + padLen + 8;
  const buf = new Uint8Array(total);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(total - 8, 0, false);
  view.setUint32(total - 4, bitLen, false);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const w = new Uint32Array(64);
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let hh = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + hh) | 0;
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((n) => (n >>> 0).toString(16).padStart(8, "0"))
    .join("");
}

function hashPassphrase(passphrase) {
  return sha256HexBytes(new TextEncoder().encode(passphrase));
}

function getSavedPassphrase() {
  return localStorage.getItem(STORAGE.syncPassphrase) || "";
}

async function getSyncKey() {
  const phrase = getSavedPassphrase();
  if (!phrase || phrase.length < 4) return null;
  return hashPassphrase(phrase);
}

async function checkSyncApi() {
  try {
    const res = await fetch("/api/studio-sync/health", { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.sync;
  } catch {
    return false;
  }
}

function setSyncStatus(message, tone = "") {
  const el = $("#sync-status");
  if (!el) return;
  el.textContent = message;
  el.className = "sync-status" + (tone ? ` is-${tone}` : "");
}

function updateSyncOfflineReminder() {
  const el = $("#sync-offline-reminder");
  if (!el) return;
  if (syncApiAvailable) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.textContent = "Server not connected — auto-sync is off right now.";
  el.hidden = false;
}

function applySyncStatusLine() {
  const saved = getSavedPassphrase();
  const last = localStorage.getItem(STORAGE.lastSyncedAt);
  if (syncApiAvailable && saved) {
    setSyncStatus(`Auto-sync on · last ${formatSyncTime(last)}`, "ok");
  } else if (syncApiAvailable) {
    setSyncStatus("Auto-sync ready — set a passphrase on each device.", "ok");
  } else {
    setSyncStatus("Not syncing right now — your changes stay on this device until the server is back.", "warn");
  }
}

async function refreshSyncPanel() {
  syncApiAvailable = await checkSyncApi();
  updateSyncOfflineReminder();
  applySyncStatusLine();
}

function formatSyncTime(ts) {
  if (!ts) return "never";
  try {
    return new Date(Number(ts)).toLocaleString();
  } catch {
    return "unknown";
  }
}

async function pullRemoteSync({ quiet = false } = {}) {
  const key = await getSyncKey();
  if (!key) {
    if (!quiet) setSyncStatus("Set a sync passphrase first.", "warn");
    return false;
  }
  if (!syncApiAvailable) {
    if (!quiet) setSyncStatus("Sync API not available on this host — use Export / Import.", "warn");
    return false;
  }
  try {
    const res = await fetch(`/api/studio-sync?key=${key}`, { cache: "no-store" });
    if (res.status === 404) {
      if (!quiet) setSyncStatus("No remote studio found — tap Sync now to upload from this device.", "warn");
      return false;
    }
    if (!res.ok) throw new Error(`pull ${res.status}`);
    const remote = await res.json();
    const localAt = Number(localStorage.getItem(STORAGE.lastSyncedAt) || 0);
    if (remote.updatedAt && remote.updatedAt > localAt) {
      applySyncBundle(remote);
      if (!quiet) setSyncStatus(`Pulled changes from ${formatSyncTime(remote.updatedAt)}.`, "ok");
    } else if (!quiet) {
      setSyncStatus(`Already up to date (last sync ${formatSyncTime(localAt)}).`, "ok");
    }
    return true;
  } catch (err) {
    if (!quiet) setSyncStatus(`Sync pull failed: ${err.message}`, "error");
    return false;
  }
}

async function pushRemoteSync({ quiet = false } = {}) {
  const key = await getSyncKey();
  if (!key) {
    if (!quiet) setSyncStatus("Set a sync passphrase first.", "warn");
    return false;
  }
  if (!syncApiAvailable) {
    if (!quiet) setSyncStatus("Sync API not available on this host — use Export / Import.", "warn");
    return false;
  }
  const bundle = buildSyncBundle();
  try {
    const res = await fetch("/api/studio-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, bundle }),
    });
    if (!res.ok) {
      let detail = `push ${res.status}`;
      try {
        const errBody = await res.json();
        if (errBody?.error) detail += `: ${errBody.error}`;
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }
    localStorage.setItem(STORAGE.lastSyncedAt, String(bundle.updatedAt));
    if (!quiet) setSyncStatus(`Synced at ${formatSyncTime(bundle.updatedAt)}.`, "ok");
    return true;
  } catch (err) {
    if (!quiet) setSyncStatus(`Sync push failed: ${err.message}`, "error");
    return false;
  }
}

function scheduleSyncPush() {
  if (!getSavedPassphrase() || !syncApiAvailable) return;
  clearTimeout(syncPushTimer);
  syncPushTimer = setTimeout(() => {
    pushRemoteSync({ quiet: true });
  }, 1200);
}

async function syncNow() {
  setSyncStatus("Syncing…");
  const pushed = await pushRemoteSync({ quiet: false });
  if (!pushed) return;
  await pullRemoteSync({ quiet: false });
}

async function initStudioSync() {
  try {
    const saved = getSavedPassphrase();
    const passInput = $("#sync-passphrase");
    if (passInput && saved) passInput.value = saved;
    await refreshSyncPanel();
    if (syncApiAvailable && saved) {
      await pullRemoteSync({ quiet: true });
      applySyncStatusLine();
    }
  } catch (err) {
    console.warn("Studio sync init failed:", err);
    syncApiAvailable = false;
    updateSyncOfflineReminder();
    setSyncStatus("Sync unavailable — try Sync now or Export / Import.", "warn");
  }
}

function exportStudioFile() {
  const bundle = buildSyncBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `our-art-studio-sync-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  setSyncStatus(`Exported studio file (${bundle.userData.added.length} added, ${Object.keys(bundle.userData.overrides).length} edited).`, "ok");
}

function importStudioFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const bundle = JSON.parse(reader.result);
      if (!bundle?.userData) throw new Error("invalid file");
      const added = bundle.userData.added?.length || 0;
      const edited = Object.keys(bundle.userData.overrides || {}).length;
      const removed = bundle.userData.removed?.length || 0;
      const msg = `Import ${added} added, ${edited} edited, ${removed} removed? This replaces your local changes on this device.`;
      if (!confirm(msg)) return;
      applySyncBundle(bundle);
      setSyncStatus(`Imported from file (${formatSyncTime(bundle.updatedAt)}).`, "ok");
      if (syncApiAvailable && getSavedPassphrase()) pushRemoteSync({ quiet: true });
    } catch (err) {
      setSyncStatus(`Import failed: ${err.message}`, "error");
    }
  };
  reader.readAsText(file);
}

function saveSyncPassphrase() {
  const phrase = $("#sync-passphrase").value.trim();
  if (phrase.length < 4) {
    setSyncStatus("Passphrase must be at least 4 characters.", "error");
    return;
  }
  localStorage.setItem(STORAGE.syncPassphrase, phrase);
  setSyncStatus("Passphrase saved on this device. Tap Sync now to link.", "ok");
  syncNow();
}

function slugifyId(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueColorId(brand, name, code) {
  const base = slugifyId(`${brand}-${code || name}`);
  let id = base || `color-${Date.now()}`;
  const taken = new Set(palette.colors.map((c) => c.id));
  userData.added.forEach((c) => taken.add(c.id));
  let n = 2;
  while (taken.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

function isUserAddedColor(id) {
  return userData.added.some((c) => c.id === id);
}

function getEditableColor(id) {
  const added = userData.added.find((c) => c.id === id);
  if (added) return { ...added };
  const base = basePalette.colors.find((c) => c.id === id);
  if (!base) return null;
  return mergeColorEntry(base, userData.overrides[id]);
}

function removeColorFromStudio(id) {
  const name = palette.colors.find((c) => c.id === id)?.name_en || id;
  const msg = `Remove “${name}” from your studio? You can add it again later from Add Color.`;
  if (!confirm(msg)) return;

  if (isUserAddedColor(id)) {
    userData.added = userData.added.filter((c) => c.id !== id);
  } else {
    if (!userData.removed.includes(id)) userData.removed.push(id);
    delete userData.overrides[id];
  }

  removeColorIdFromAllKits(id);
  selectedMixSlots = selectedMixSlots.map((x) => (x === id ? null : x));
  compactMixSlots();

  persistPaletteChanges();
  detailColor = null;
  $("#detail-sheet").close();
}

function colorFromForm() {
  const hexRaw = $("#f-hex").value.trim();
  const hex = hexRaw.startsWith("#") ? hexRaw : `#${hexRaw}`;
  const transparency = $("#f-transparency").value;
  const lightfastness = $("#f-lightfastness").value;
  const toxicity = $("#f-toxicity").value || "low";
  const entry = {
    brand: $("#f-brand").value.trim(),
    name_en: $("#f-name-en").value.trim(),
    name_zh: $("#f-name-zh").value.trim() || undefined,
    code: $("#f-code").value.trim() || undefined,
    pigment: $("#f-pigment").value.trim() || undefined,
    hex: hex.toUpperCase(),
    format: $("#f-format").value.trim() || undefined,
    size: $("#f-size").value.trim() || undefined,
    family: $("#f-family").value.trim() || undefined,
    notes: $("#f-notes").value.trim() || undefined,
    ace_note: $("#f-ace-note").value.trim() || undefined,
    best_for: $("#f-best-for").value.trim() || undefined,
    granulating: $("#f-granulating").checked,
    staining: $("#f-staining").checked,
    toxicity,
    brand_traits: ["user"],
  };
  if (transparency) entry.transparency = Number(transparency);
  if (lightfastness) entry.lightfastness = Number(lightfastness);
  const habit = $("#f-toxicity-habit").value.trim();
  if (habit && toxicity !== "low") entry.toxicity_habit = habit;
  else if (toxicity === "low") entry.toxicity_habit = undefined;
  return entry;
}

function fillColorForm(c) {
  if (!c) {
    editingColorId = null;
    $("#color-form").reset();
    $("#f-hex-picker").value = "#888888";
    $("#f-toxicity").value = "low";
    $("#add-form-title").textContent = "Add a new color";
    $("#add-form-hint").textContent =
      "Enter what’s on the tube or pan label. Saves on this device — great for new paints before they’re in the master list.";
    $("#color-form-submit").textContent = "Save color";
    $("#color-form-cancel").hidden = true;
    return;
  }
  editingColorId = c.id;
  $("#f-brand").value = c.brand || "";
  $("#f-code").value = c.code || "";
  $("#f-name-en").value = c.name_en || "";
  $("#f-name-zh").value = c.name_zh || "";
  $("#f-pigment").value = c.pigment || "";
  $("#f-hex").value = (c.hex || "#888888").toUpperCase();
  $("#f-hex-picker").value = normalizeHexForPicker(c.hex);
  populateFamilyFormSelect();
  $("#f-format").value = mapFormatForForm(c.format);
  $("#f-size").value = c.size || "";
  const fam = (c.family || "").trim();
  if (fam && ![...$("#f-family").options].some((o) => o.value === fam)) {
    const opt = document.createElement("option");
    opt.value = fam;
    opt.textContent = fam;
    $("#f-family").appendChild(opt);
  }
  $("#f-family").value = fam;
  $("#f-toxicity").value = toxicityLevel(c);
  $("#f-transparency").value = c.transparency != null ? String(c.transparency) : "";
  $("#f-lightfastness").value = c.lightfastness != null ? String(c.lightfastness) : "";
  $("#f-granulating").checked = !!c.granulating;
  $("#f-staining").checked = !!c.staining;
  $("#f-notes").value = c.notes || "";
  $("#f-ace-note").value = c.ace_note || "";
  $("#f-best-for").value = c.best_for || "";
  $("#f-toxicity-habit").value = c.toxicity_habit || "";
  $("#add-form-title").textContent = "Edit color";
  $("#add-form-hint").textContent = "Fix a code, name, or swatch — changes save on this device only.";
  $("#color-form-submit").textContent = "Save changes";
  $("#color-form-cancel").hidden = false;
}

function normalizeHexForPicker(hex) {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return "#888888";
  return hex;
}

function showFormStatus(msg, isError = false) {
  const el = $("#color-form-status");
  el.hidden = false;
  el.textContent = msg;
  el.classList.toggle("is-error", isError);
}

function clearFormStatus() {
  const el = $("#color-form-status");
  el.hidden = true;
  el.textContent = "";
  el.classList.remove("is-error");
}

function saveColorFromForm(e) {
  e.preventDefault();
  clearFormStatus();
  const data = colorFromForm();
  if (!data.brand || !data.name_en) {
    showFormStatus("Brand and English name are required.", true);
    return;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(data.hex)) {
    showFormStatus("Swatch hex must look like #AABBCC.", true);
    return;
  }

  if (editingColorId) {
    if (isUserAddedColor(editingColorId)) {
      const idx = userData.added.findIndex((c) => c.id === editingColorId);
      if (idx >= 0) {
        userData.added[idx] = { ...userData.added[idx], ...data, id: editingColorId, user_added: true };
      }
    } else {
      const base = basePalette.colors.find((c) => c.id === editingColorId);
      if (!base) {
        showFormStatus("Could not find that color to edit.", true);
        return;
      }
      const override = { ...data };
      Object.keys(override).forEach((k) => {
        if (override[k] === base[k]) delete override[k];
      });
      if (Object.keys(override).length) userData.overrides[editingColorId] = override;
      else delete userData.overrides[editingColorId];
    }
    persistPaletteChanges();
    const updated = palette.colors.find((c) => c.id === editingColorId);
    showFormStatus(`Updated “${updated?.name_en || data.name_en}”.`);
    fillColorForm(null);
    if (updated) {
      switchTab("palette");
      openDetail(updated);
    }
    return;
  }

  const id = uniqueColorId(data.brand, data.name_en, data.code);
  userData.added.push({ ...data, id, user_added: true });
  persistPaletteChanges();
  showFormStatus(`Added “${data.name_en}” to your studio.`);
  fillColorForm(null);
  switchTab("palette");
  const created = palette.colors.find((c) => c.id === id);
  if (created) openDetail(created);
}

function startEditColor(c) {
  fillColorForm(getEditableColor(c.id) || c);
  $("#detail-sheet").close();
  switchTab("add");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadUserLists() {
  // Legacy single "current" list retired — kits replace it
  localStorage.removeItem(STORAGE.current);
  localStorage.removeItem("our-art-studio-wishlist");
}

function uid(prefix = "kit") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeKit(raw) {
  const total = Math.min(
    KIT_SLOT_MAX,
    Math.max(KIT_SLOT_MIN, Number(raw.slots?.length || raw.slotCount || 12))
  );
  const slots = Array.from({ length: total }, (_, i) => {
    const id = raw.slots?.[i];
    return id && palette.colors.some((c) => c.id === id) ? id : null;
  });
  return {
    id: raw.id || uid(),
    name: (raw.name || "Kit").trim() || "Kit",
    layout: raw.layout === "home-tin" ? "home-tin" : "grid",
    slots,
    notes: typeof raw.notes === "string" ? raw.notes : "",
    orderMode: raw.orderMode === "spectrum" ? "spectrum" : "manual",
  };
}

function makeHomeKit() {
  const slots = Array.from({ length: HOME_TIN.total }, (_, i) => {
    const id = HOME_DEFAULT_SLOTS[i] || null;
    return id && palette.colors.some((c) => c.id === id) ? id : null;
  });
  return {
    id: "kit-home",
    name: "Home",
    layout: "home-tin",
    slots,
    notes:
      "Home tin from studio photos. Empty wells: WN purple, DS transparent green (card), DS 932 — add when catalogued. Still needs / notes: edit freely.",
    orderMode: "manual",
  };
}

function saveKits() {
  try {
    localStorage.setItem(STORAGE.kits, JSON.stringify(kits));
    if (activeKitId) localStorage.setItem(STORAGE.activeKit, activeKitId);
  } catch {
    /* ignore quota */
  }
}

function loadKits() {
  const valid = new Set(palette.colors.map((c) => c.id));
  let loaded = [];
  try {
    loaded = JSON.parse(localStorage.getItem(STORAGE.kits) || "[]");
  } catch {
    loaded = [];
  }
  if (!Array.isArray(loaded) || !loaded.length) {
    kits = [makeHomeKit()];
    activeKitId = kits[0].id;
    saveKits();
    return;
  }
  kits = loaded.map((k) => {
    const n = normalizeKit(k);
    n.slots = n.slots.map((id) => (id && valid.has(id) ? id : null));
    return n;
  });
  const savedActive = localStorage.getItem(STORAGE.activeKit);
  activeKitId =
    kits.find((k) => k.id === savedActive)?.id || kits[0]?.id || null;
}

function getActiveKit() {
  return kits.find((k) => k.id === activeKitId) || kits[0] || null;
}

function removeColorIdFromAllKits(id) {
  let changed = false;
  kits.forEach((k) => {
    k.slots = k.slots.map((s) => {
      if (s === id) {
        changed = true;
        return null;
      }
      return s;
    });
  });
  if (changed) saveKits();
}

function kitFilledCount(kit) {
  return kit.slots.filter(Boolean).length;
}

function activeKitIds() {
  const kit = getActiveKit();
  return kit ? kit.slots.filter(Boolean) : [];
}

function colorInActiveKit(id) {
  return activeKitIds().includes(id);
}

function localDateKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pickRandomTodaysColors(forceNew = false) {
  const today = localDateKey();
  if (!forceNew) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.todays) || "null");
      if (saved?.date === today && saved.ids?.length === 3) {
        const colors = saved.ids.map((id) => palette.colors.find((c) => c.id === id)).filter(Boolean);
        if (colors.length === 3) return colors;
      }
    } catch {
      /* use fresh draw */
    }
  }

  const pool = [...palette.colors];
  const picked = [];
  while (picked.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(i, 1)[0]);
  }
  localStorage.setItem(
    STORAGE.todays,
    JSON.stringify({ date: today, ids: picked.map((c) => c.id) })
  );
  return picked;
}

function renderTodaysPalette() {
  const colors = pickRandomTodaysColors(false);
  const swatches = $("#todays-swatches");
  const names = $("#todays-names");
  swatches.innerHTML = "";
  colors.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "todays-swatch-btn";
    btn.style.background = c.hex;
    btn.title = c.name_en;
    btn.setAttribute("aria-label", c.name_en);
    btn.innerHTML = swatchMarksHtml(c);
    btn.addEventListener("click", () => openDetail(c));
    swatches.appendChild(btn);
  });
  names.innerHTML = colors
    .map(
      (c) =>
        `<span class="todays-name-line">${escapeHtml(c.name_en)} · ${escapeHtml(c.brand)}</span>`
    )
    .join("");
}

function shuffleTodaysPalette() {
  pickRandomTodaysColors(true);
  renderTodaysPalette();
}

function colorsByIds(ids) {
  return Mixing.sortBySpectrum(
    ids.map((id) => palette.colors.find((c) => c.id === id)).filter(Boolean)
  );
}

function buildColorCard(group, { showListMarkers = true } = {}) {
  const c = group.primary || group;
  const variants = group.variants || [c];
  const wrap = document.createElement("div");
  wrap.className = "color-card-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "color-card";
  btn.dataset.colorId = c.id;
  const swatchMarks = swatchMarksHtml(c);
  const inKit = variants.some((v) => colorInActiveKit(v.id));
  const markerHtml =
    showListMarkers && inKit ? `<p class="brand-tag card-marker">★ kit</p>` : "";
  btn.innerHTML = `
    <div class="swatch" style="background:${c.hex}">${swatchMarks}</div>
    <div class="color-card-meta">
      <p class="name-en">${escapeHtml(c.name_en)}</p>
      <p class="name-zh">${escapeHtml(c.name_zh || "")}</p>
      <p class="brand-tag">${escapeHtml(cardBrandLine(c, variants))}</p>
      ${markerHtml}
    </div>
  `;
  btn.addEventListener("click", () => openDetail(c));
  wrap.appendChild(btn);

  return wrap;
}

function renderColorGrid(container, colors, options = {}) {
  container.innerHTML = "";
  if (!colors.length) {
    container.innerHTML = `<p class="empty-state">${escapeHtml(options.emptyMessage || "No colors yet.")}</p>`;
    return;
  }
  const groups =
    options.groupVariants === false
      ? colors.map((c) => ({ primary: c, variants: [c] }))
      : groupColorsByBrandName(colors);
  groups.forEach((group) => {
    container.appendChild(
      buildColorCard(group, {
        showListMarkers: options.showListMarkers,
      })
    );
  });
}

function renderPalette() {
  renderColorGrid($("#palette-grid"), filteredColors(), {
    emptyMessage: "No colors match — try another search.",
  });
}

function updateTabBadges() {
  $$(".tab").forEach((tab) => {
    const name = tab.dataset.tab;
    tab.querySelector(".tab-badge")?.remove();
    let count = 0;
    if (name === "kits") {
      const kit = getActiveKit();
      count = kit ? kitFilledCount(kit) : 0;
    }
    if (count > 0) {
      const badge = document.createElement("span");
      badge.className = "tab-badge";
      badge.textContent = String(count);
      tab.appendChild(badge);
    }
  });
}

function renderKits() {
  const chips = $("#kit-chips");
  const workspace = $("#kit-workspace");
  const empty = $("#kit-empty-state");
  if (!chips) return;

  chips.innerHTML = "";
  kits.forEach((kit) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kit-chip" + (kit.id === activeKitId ? " active" : "");
    btn.textContent = `${kit.name} (${kitFilledCount(kit)}/${kit.slots.length})`;
    btn.addEventListener("click", () => {
      activeKitId = kit.id;
      saveKits();
      renderKits();
      updateTabBadges();
      renderPalette();
    });
    chips.appendChild(btn);
  });

  const kit = getActiveKit();
  if (!kit) {
    workspace.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  workspace.hidden = false;
  $("#kit-active-name").textContent = kit.name;
  $("#kit-active-meta").textContent = `${kitFilledCount(kit)} / ${kit.slots.length} wells · ${
    kit.orderMode === "spectrum" ? "spectrum order" : "manual / tin order"
  }`;
  $("#kit-notes").value = kit.notes || "";
  renderKitTin(kit);
}

function renderKitTin(kit) {
  const tin = $("#kit-tin");
  if (!tin) return;
  tin.className = "kit-tin" + (kit.layout === "home-tin" ? " kit-tin--home" : " kit-tin--grid");
  tin.innerHTML = "";

  if (kit.layout === "home-tin" && kit.slots.length === HOME_TIN.total) {
    const left = document.createElement("div");
    left.className = "kit-zone kit-zone-left";
    for (let i = 0; i < 16; i++) left.appendChild(makeKitWell(kit, i));
    const mid = document.createElement("div");
    mid.className = "kit-zone kit-zone-mid";
    const mix = document.createElement("div");
    mix.className = "kit-mix-well";
    mix.title = "Mixing area (not a color slot)";
    mid.appendChild(mix);
    for (let i = 16; i < 18; i++) mid.appendChild(makeKitWell(kit, i, true));
    const right = document.createElement("div");
    right.className = "kit-zone kit-zone-right";
    for (let i = 18; i < 26; i++) right.appendChild(makeKitWell(kit, i));
    const bottom = document.createElement("div");
    bottom.className = "kit-zone kit-zone-bottom";
    for (let i = 26; i < 36; i++) bottom.appendChild(makeKitWell(kit, i));
    const row = document.createElement("div");
    row.className = "kit-tin-top";
    row.appendChild(left);
    row.appendChild(mid);
    row.appendChild(right);
    tin.appendChild(row);
    tin.appendChild(bottom);
  } else {
    const grid = document.createElement("div");
    grid.className = "kit-zone kit-zone-grid";
    kit.slots.forEach((_, i) => grid.appendChild(makeKitWell(kit, i)));
    tin.appendChild(grid);
  }
}

function makeKitWell(kit, index, large = false) {
  const id = kit.slots[index];
  const color = id ? palette.colors.find((c) => c.id === id) : null;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "kit-well" + (large ? " kit-well--large" : "") + (color ? "" : " kit-well--empty");
  btn.dataset.slot = String(index);
  if (color) {
    btn.style.background = color.hex;
    btn.title = `${color.name_en} — tap to remove`;
    btn.innerHTML = `<span class="kit-well-name">${escapeHtml(color.name_en)}</span>`;
  } else {
    btn.title = "Empty well — tap to pick a color";
    btn.innerHTML = `<span class="kit-well-plus">+</span>`;
  }
  btn.addEventListener("click", () => {
    if (color) {
      kit.slots[index] = null;
      kit.orderMode = "manual";
      saveKits();
      renderKits();
      updateTabBadges();
      renderPalette();
      refreshDetailActions();
    } else {
      openKitPicker(index);
    }
  });
  return btn;
}

function openKitPicker(slotIndex) {
  kitFillSlotIndex = slotIndex;
  const sheet = $("#kit-picker-sheet");
  $("#kit-picker-search").value = "";
  renderKitPickerGrid();
  sheet.showModal();
}

function renderKitPickerGrid() {
  const q = ($("#kit-picker-search")?.value || "").trim().toLowerCase();
  let list = Mixing.sortBySpectrum(palette.colors);
  if (q) {
    list = list.filter((c) => {
      const hay = [c.name_en, c.name_zh, c.brand, c.pigment, c.code, c.family]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  const kit = getActiveKit();
  const used = new Set(kit?.slots.filter(Boolean) || []);
  renderColorGrid($("#kit-picker-grid"), list, {
    emptyMessage: "No match in palette.",
    showListMarkers: false,
  });
  $("#kit-picker-grid").querySelectorAll(".color-card").forEach((card) => {
    const id = card.dataset.colorId;
    if (used.has(id)) card.classList.add("kit-picker-used");
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      fillKitSlot(id);
    });
  });
}

function fillKitSlot(colorId) {
  const kit = getActiveKit();
  if (!kit || kitFillSlotIndex == null) return;
  if (!palette.colors.some((c) => c.id === colorId)) return;
  kit.slots[kitFillSlotIndex] = colorId;
  kit.orderMode = "manual";
  kitFillSlotIndex = null;
  saveKits();
  $("#kit-picker-sheet").close();
  renderKits();
  updateTabBadges();
  renderPalette();
  refreshDetailActions();
}

function arrangeActiveKitSpectrum() {
  const kit = getActiveKit();
  if (!kit) return;
  const filled = kit.slots.map((id) => palette.colors.find((c) => c.id === id)).filter(Boolean);
  if (filled.length < 2) {
    alert("Add at least two colors before arranging.");
    return;
  }
  const sorted = Mixing.sortBySpectrum(filled);
  const empties = kit.slots.length - sorted.length;
  kit.slots = [...sorted.map((c) => c.id), ...Array(empties).fill(null)];
  kit.orderMode = "spectrum";
  saveKits();
  renderKits();
}

function createNewKit() {
  const name = (prompt("Kit name?", "Travel") || "").trim();
  if (!name) return;
  let n = Number(prompt(`How many wells? (${KIT_SLOT_MIN}–${KIT_SLOT_MAX})`, "12"));
  if (!Number.isFinite(n)) return;
  n = Math.min(KIT_SLOT_MAX, Math.max(KIT_SLOT_MIN, Math.round(n)));
  const kit = normalizeKit({
    id: uid(),
    name,
    layout: "grid",
    slots: Array(n).fill(null),
    notes: "",
    orderMode: "manual",
  });
  kits.push(kit);
  activeKitId = kit.id;
  saveKits();
  renderKits();
  updateTabBadges();
}

function renameActiveKit() {
  const kit = getActiveKit();
  if (!kit) return;
  const name = (prompt("Rename kit", kit.name) || "").trim();
  if (!name) return;
  kit.name = name;
  saveKits();
  renderKits();
}

function deleteActiveKit() {
  const kit = getActiveKit();
  if (!kit) return;
  if (kits.length <= 1) {
    alert("Keep at least one kit — or empty its wells.");
    return;
  }
  if (!confirm(`Delete kit “${kit.name}”?`)) return;
  kits = kits.filter((k) => k.id !== kit.id);
  activeKitId = kits[0].id;
  saveKits();
  renderKits();
  updateTabBadges();
  renderPalette();
}

function addToActiveKit(id) {
  const kit = getActiveKit();
  if (!kit || !palette.colors.some((c) => c.id === id)) return;
  if (kit.slots.includes(id)) return;
  const empty = kit.slots.indexOf(null);
  if (empty < 0) {
    alert(`“${kit.name}” is full (${kit.slots.length} wells).`);
    return;
  }
  kit.slots[empty] = id;
  kit.orderMode = "manual";
  saveKits();
  renderKits();
  renderPalette();
  updateTabBadges();
  refreshDetailActions();
}

function removeFromActiveKit(id) {
  const kit = getActiveKit();
  if (!kit) return;
  kit.slots = kit.slots.map((s) => (s === id ? null : s));
  kit.orderMode = "manual";
  saveKits();
  renderKits();
  renderPalette();
  updateTabBadges();
  refreshDetailActions();
}

function refreshDetailActions() {
  if (!detailColor) return;
  updateDetailActionButtons(detailColor);
}

function getSelectedMixColors() {
  return selectedMixSlots.map((id) =>
    id ? palette.colors.find((c) => c.id === id) || null : null
  );
}

function compactMixSlots() {
  const ids = selectedMixSlots.filter(Boolean);
  selectedMixSlots = [...ids, null, null, null].slice(0, 3);
}

function applyMixSwap(replaceId, withId) {
  if (!replaceId || !withId || replaceId === withId) return;
  const target = palette.colors.find((c) => c.id === withId);
  if (!target) return;

  const idx = selectedMixSlots.indexOf(replaceId);
  if (idx < 0) return;

  const existing = selectedMixSlots.indexOf(withId);
  if (existing >= 0 && existing !== idx) {
    selectedMixSlots[existing] = null;
  }
  selectedMixSlots[idx] = withId;
  compactMixSlots();
  renderMixPicker();
}

function renderWarningSegmentsHtml(warning) {
  const segments = warning.segments || [{ t: warning.text || String(warning) }];
  return segments
    .map((seg) => {
      if (seg.swap) {
        const { replaceId, withId, label } = seg.swap;
        return `<button type="button" class="mix-swap-link" data-replace-id="${escapeHtml(replaceId)}" data-with-id="${escapeHtml(withId)}">${escapeHtml(label)}</button>`;
      }
      return escapeHtml(seg.t || "");
    })
    .join("");
}

function renderMixWorkspaceTipsHtml(tips) {
  if (!tips?.length) return "";
  const items = tips
    .slice(0, 2)
    .map((tip) => {
      const badge = tip.verified
        ? '<span class="mix-tip-badge verified">Verified</span>'
        : '<span class="mix-tip-badge guess">Ace\'s guess</span>';
      return `<li class="mix-workspace-tip">${badge}<p class="mix-workspace-tip-result">${escapeHtml(tip.result)}</p></li>`;
    })
    .join("");
  return `<ul class="mix-workspace-tips">${items}</ul>`;
}

function bindMixSwapLinks(container) {
  container.querySelectorAll(".mix-swap-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      applyMixSwap(btn.dataset.replaceId, btn.dataset.withId);
    });
  });
}

function renderMixWorkspace() {
  const workspace = $("#mix-workspace");
  const colors = getSelectedMixColors();
  const filled = colors.filter(Boolean);
  const labels = ["A", "B", "C"];

  let swatchHtml = "";
  labels.forEach((label, i) => {
    const c = colors[i];
    if (c) {
      const marks = swatchMarksHtml(c);
      swatchHtml += `<button type="button" class="mix-slot-swatch mix-slot-swatch--filled" data-slot-index="${i}" style="background:${c.hex}" title="Tap to remove ${escapeHtml(c.name_en)}" aria-label="Remove ${escapeHtml(c.name_en)} from slot ${label}">${marks}</button>`;
    } else {
      swatchHtml += `<span class="mix-slot-swatch mix-slot-swatch--empty" aria-label="Slot ${label}"></span>`;
    }
  });

  swatchHtml += '<span class="combo-arrow">→</span>';

  let mix = null;
  if (filled.length >= 2) {
    mix = Mixing.mixColors(filled, palette);
    swatchHtml += `<span class="combo-result-swatch" style="background:${mix.hex}"></span>`;
  } else {
    swatchHtml += '<span class="combo-result-swatch mix-result-empty"></span>';
  }

  let cardsHtml = '<div class="mix-slot-cards">';
  labels.forEach((label, i) => {
    const c = colors[i];
    if (c) {
      // div + role=button so #code links can stay nested buttons
      cardsHtml += `
        <div class="mix-slot-card mix-slot-card--filled" data-slot-index="${i}" role="button" tabindex="0" title="Tap to remove" aria-label="Remove ${escapeHtml(c.name_en)} from slot ${label}">
          <span class="mix-slot-label">${label} · tap to remove</span>
          <p class="mix-slot-name">${escapeHtml(c.name_en)}</p>
          <p class="brand-tag mix-slot-brand">${escapeHtml(cardBrandLine(c))}</p>
          <ul class="hue-info-variants">${renderHueVariantLines(findColorVariants(c))}</ul>
        </div>`;
    } else {
      cardsHtml += `
        <div class="mix-slot-card mix-slot-card--empty">
          <span class="mix-slot-label">${label}</span>
          <p class="mix-slot-placeholder">—</p>
        </div>`;
    }
  });
  cardsHtml += "</div>";

  const scoreHtml = mix
    ? `<p class="combo-score">≈ ${mix.hex.toUpperCase()} · ${mix.hueName}</p>`
    : filled.length === 1
      ? '<p class="combo-score mix-score-hint">Add a second color — then we guess.</p>'
      : filled.length === 0
        ? '<p class="combo-score mix-score-hint">Tap colors below, or Load this mix from Find a hue.</p>'
        : "";

  const tipsHtml = mix ? renderMixWorkspaceTipsHtml(mix.tips) : "";

  const warningsHtml = mix
    ? `<ul class="mix-warnings">${mix.warnings
        .map((w) => `<li>${renderWarningSegmentsHtml(w)}</li>`)
        .join("")}</ul>`
    : "";

  workspace.innerHTML = `
    <div class="combo-swatches mix-equation-swatches">${swatchHtml}</div>
    ${cardsHtml}
    ${scoreHtml}
    ${tipsHtml}
    ${warningsHtml}
  `;
  bindHueCodeLinks(workspace);
  bindMixSwapLinks(workspace);

  const onClearSlot = (el, e) => {
    if (e.target.closest(".hue-code-link")) return;
    e.stopPropagation();
    const idx = Number(el.dataset.slotIndex);
    if (!Number.isNaN(idx)) clearMixSlotAt(idx);
  };
  workspace.querySelectorAll("[data-slot-index]").forEach((el) => {
    el.addEventListener("click", (e) => onClearSlot(el, e));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClearSlot(el, e);
      }
    });
  });

  $("#mix-clear").hidden = filled.length === 0;
}

function mixPickerColors() {
  const colors = mixPickerStarsOnly
    ? palette.colors.filter((c) => c.mix_star)
    : palette.colors;
  return Mixing.sortBySpectrum(colors);
}

function renderMixPicker() {
  const wrap = $("#mix-picker");
  wrap.innerHTML = "";
  const toggle = $("#mix-stars-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(mixPickerStarsOnly));
    toggle.classList.toggle("is-active", mixPickerStarsOnly);
  }
  mixPickerColors().forEach((c) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className =
      "mix-chip" + (selectedMixSlots.includes(c.id) ? " selected" : "");
    chip.dataset.id = c.id;
    const marks = swatchMarksHtml(c);
    chip.innerHTML = `
      <span class="mini-swatch" style="background:${c.hex}">${marks}</span>
      <span>${escapeHtml(c.name_en)}</span>
    `;
    chip.addEventListener("click", () => toggleMixColor(c));
    wrap.appendChild(chip);
  });
  renderMixWorkspace();
}

const FORMAT_PRIORITY = {
  "half-pan": 0,
  "full pan": 0,
  "2ml sample": 1,
  tube: 2,
  "tube-box": 3,
};

function formatPriority(c) {
  return FORMAT_PRIORITY[c.format] ?? 5;
}

function buildVariantIndex() {
  variantIndex = new Map();
  palette.colors.forEach((c) => {
    const key = (c.name_en || "").toLowerCase();
    if (!variantIndex.has(key)) variantIndex.set(key, []);
    variantIndex.get(key).push(c);
  });
  variantIndex.forEach((list) => {
    list.sort((a, b) => {
      const byBrand = (a.brand || "").localeCompare(b.brand || "");
      if (byBrand) return byBrand;
      return formatPriority(a) - formatPriority(b);
    });
  });
}

function findColorVariants(c) {
  return variantIndex.get((c.name_en || "").toLowerCase()) || [];
}

function ensureMixPicker() {
  if (!mixPickerBuilt) {
    renderMixPicker();
    mixPickerBuilt = true;
  }
}

function formatDisplayText(c) {
  const format = (c.format || "").trim();
  const size = (c.size || "").trim();
  if (!format && !size) return "";
  if (format && /\d+\s*ml/i.test(format)) return format;
  if (format === "tube" && size) return `${size} tube`;
  if ((format === "sample" || format.includes("sample")) && size && !/\d/.test(format)) {
    return `${size} sample`;
  }
  return format || size;
}

function uniqueFormatTexts(colors) {
  const seen = new Set();
  const out = [];
  colors.forEach((c) => {
    const text = formatDisplayText(c);
    if (!text) return;
    const key = text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(text);
  });
  return out;
}

function brandNameKey(c) {
  return `${c.brand}|${(c.name_en || "").toLowerCase()}`;
}

function groupColorsByBrandName(colors) {
  const map = new Map();
  colors.forEach((c) => {
    const key = brandNameKey(c);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(c);
  });
  return [...map.values()].map((variants) => {
    const sorted = [...variants].sort(
      (a, b) => formatPriority(a) - formatPriority(b) || a.id.localeCompare(b.id)
    );
    return { primary: sorted[0], variants: sorted };
  });
}

function cardBrandLine(c, variants = [c]) {
  const formats = uniqueFormatTexts(variants);
  const formatStr = formats.join(", ");
  const parts = [c.brand, formatStr || formatDisplayText(c)].filter(Boolean);
  return parts.join(" · ");
}

function inventoryLabelText(c) {
  return cardBrandLine(c);
}

function renderHueVariantLines(variants) {
  return variants
    .map((c) => {
      const brand = escapeHtml(c.brand || "");
      const code = c.code ? escapeHtml(c.code) : "";
      const formatText = formatDisplayText(c);
      const format = formatText ? escapeHtml(formatText) : "";
      const codeBtn = code
        ? `<button type="button" class="hue-code-link" data-color-id="${escapeHtml(c.id)}">#${code}</button>`
        : "";
      const extras = format;
      const afterBrand = [codeBtn, extras].filter(Boolean).join(", ");
      return `<li class="hue-variant-line">${brand}${afterBrand ? `, ${afterBrand}` : ""}</li>`;
    })
    .join("");
}

function bindHueCodeLinks(container) {
  container.querySelectorAll(".hue-code-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const col = palette.colors.find((x) => x.id === btn.dataset.colorId);
      if (col) openDetail(col);
    });
  });
}

function colorDisplayName(c) {
  return `${c.name_en} · ${c.name_zh || ""}`.replace(/ · $/, "");
}

function setActiveColorLinks(colorId) {
  $$(".combo-color-link, .combo-swatch-btn").forEach((el) => {
    el.classList.toggle("active", el.dataset.colorId === colorId);
  });
}

function clearInlineHueColorInfo() {
  $$(".hue-color-tag--inline").forEach((el) => el.remove());
  const global = $("#hue-color-info");
  if (global) global.hidden = true;
}

function hueColorInfoInnerHtml(c) {
  return `
    <div class="hue-info-swatch" style="background:${escapeHtml(c.hex)}" aria-hidden="true">${swatchMarksHtml(c)}</div>
    <div class="hue-info-text">
      <p class="hue-info-name">${escapeHtml(colorDisplayName(c))}</p>
      <ul class="hue-info-variants">${renderHueVariantLines(findColorVariants(c))}</ul>
    </div>`;
}

/** Show color peek just above the combo card that was tapped (no jump to top). */
function showHueColorInfo(c, anchorCard) {
  if (!c) return;
  clearInlineHueColorInfo();
  setActiveColorLinks(c.id);

  if (!anchorCard || !anchorCard.parentNode) {
    const panel = $("#hue-color-info");
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = hueColorInfoInnerHtml(c);
    bindHueCodeLinks(panel);
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  const panel = document.createElement("div");
  panel.className = "hue-color-tag hue-color-tag--inline";
  panel.innerHTML = hueColorInfoInnerHtml(c);
  bindHueCodeLinks(panel);
  anchorCard.parentNode.insertBefore(panel, anchorCard);
  requestAnimationFrame(() => {
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function bindColorLocateClick(el, card) {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    const col = palette.colors.find((x) => x.id === el.dataset.colorId);
    if (col) showHueColorInfo(col, card);
  });
}

function loadMixIntoPicker(colors) {
  const ids = (colors || []).filter(Boolean).map((c) => c.id).slice(0, 3);
  selectedMixSlots = [...ids, null, null, null].slice(0, 3);
  mixPickerBuilt = false;
  ensureMixPicker();
  renderMixPicker();
  const workspace = $("#mix-workspace");
  if (workspace) {
    workspace.scrollIntoView({ behavior: "smooth", block: "nearest" });
    workspace.classList.add("mix-workspace-flash");
    setTimeout(() => workspace.classList.remove("mix-workspace-flash"), 900);
  }
}

function clearMixSlotAt(index) {
  if (index < 0 || index > 2) return;
  if (!selectedMixSlots[index]) return;
  selectedMixSlots[index] = null;
  compactMixSlots();
  renderMixPicker();
}

function toggleMixColor(c) {
  const slot = selectedMixSlots.indexOf(c.id);
  if (slot >= 0) {
    selectedMixSlots[slot] = null;
    compactMixSlots();
  } else {
    const empty = selectedMixSlots.indexOf(null);
    if (empty < 0) return;
    selectedMixSlots[empty] = c.id;
  }
  renderMixPicker();
}

function locateColorInPalette(colorId) {
  const c = palette.colors.find((x) => x.id === colorId);
  if (!c) return;

  $$(".tab").forEach((tab) => {
    const isPalette = tab.dataset.tab === "palette";
    tab.classList.toggle("active", isPalette);
    tab.setAttribute("aria-selected", String(isPalette));
  });
  $$(".panel").forEach((p) => {
    const isPalette = p.id === "panel-palette";
    p.classList.toggle("active", isPalette);
    p.hidden = !isPalette;
  });

  $("#brand-filter").value = c.brand;
  $("#family-filter").value = "";
  $("#search").value = c.code || c.name_en;
  renderPalette();

  requestAnimationFrame(() => {
    const card = document.querySelector(`.color-card[data-color-id="${colorId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("highlight");
      setTimeout(() => card.classList.remove("highlight"), 1600);
    }
  });
}

function buildHueComboCard(combo) {
  const card = document.createElement("div");
  card.className = "combo-card";
  const starCount = combo.colors.filter((c) => c.mix_star).length;
  const swatches = combo.colors
    .map(
      (c) =>
        `<button type="button" class="combo-swatch-btn" data-color-id="${escapeHtml(c.id)}" style="background:${c.hex}" title="${escapeHtml(c.name_en)} — tap for brand &amp; code" aria-label="${escapeHtml(c.name_en)}">${swatchMarksHtml(c)}</button>`
    )
    .join("");
  const nameLinks = combo.colors
    .map(
      (col, i) =>
        `<button type="button" class="combo-color-link" data-color-id="${escapeHtml(col.id)}">${escapeHtml(col.name_en)}</button>${i < combo.colors.length - 1 ? " + " : ""}`
    )
    .join("");
  const starBadge =
    starCount > 0
      ? `<p class="combo-mix-star-badge">◈ ${starCount} mixer${starCount === 1 ? "" : "s"}</p>`
      : "";
  const tip = combo.tip;
  const tipBadge = tip
    ? tip.verified
      ? '<span class="mix-tip-badge verified combo-tip-badge">Verified</span>'
      : '<span class="mix-tip-badge guess combo-tip-badge">Ace\'s guess</span>'
    : "";
  const noteHtml = combo.note
    ? `<p class="combo-note">${tipBadge}${escapeHtml(combo.note)}</p>`
    : tipBadge
      ? `<p class="combo-note">${tipBadge}</p>`
      : "";
  const loadIds = combo.colors.map((c) => c.id).join(",");
  card.innerHTML = `
    <div class="combo-swatches">
      ${swatches}
      <span class="combo-arrow">→</span>
      <span class="combo-result-swatch" style="background:${combo.mix.hex}"></span>
    </div>
    <p class="combo-names">${nameLinks}</p>
    <p class="combo-score">≈ ${combo.mix.hex.toUpperCase()} · ${combo.mix.hueName}</p>
    ${starBadge}
    ${noteHtml}
    <button type="button" class="btn-ghost btn-compact combo-load-mix" data-load-ids="${escapeHtml(loadIds)}">Load this mix</button>
  `;
  card.querySelectorAll(".combo-color-link, .combo-swatch-btn").forEach((el) => {
    bindColorLocateClick(el, card);
  });
  card.querySelector(".combo-load-mix")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const ids = (e.currentTarget.dataset.loadIds || "").split(",").filter(Boolean);
    const cols = ids.map((id) => palette.colors.find((x) => x.id === id)).filter(Boolean);
    if (cols.length) loadMixIntoPicker(cols);
  });
  return card;
}

function renderHueResults(groups) {
  const container = $("#hue-results");
  container.innerHTML = "";

  const bases = groups.bases || [];
  const variations = groups.variations || [];
  const creative = groups.creative || [];

  const appendSection = (title, hint, list) => {
    if (!list.length) return;
    const label = document.createElement("p");
    label.className = "hue-results-label";
    label.textContent = title;
    container.appendChild(label);
    if (hint) {
      const h = document.createElement("p");
      h.className = "hue-results-hint";
      h.textContent = hint;
      container.appendChild(h);
    }
    list.forEach((combo) => container.appendChild(buildHueComboCard(combo)));
  };

  appendSection("The recipe", "Two tubes. Nail this before you get fancy.", bases);
  appendSection("+ one more", "Mute it, freckle it, or give it body.", variations);
  appendSection("What if…", "Odder threes that still land near the color.", creative);
}

function runHueSearch() {
  const input = $("#hue-input").value.trim() || "purple";
  const target = Mixing.parseHueInput(input);
  const container = $("#hue-results");
  container.innerHTML = '<p class="empty-state">Hunting recipes…</p>';
  clearInlineHueColorInfo();
  setActiveColorLinks(null);

  if (!target) {
    container.innerHTML =
      '<p class="empty-state">Try purple, sage, coral, gray…</p>';
    return;
  }

  let groups;
  try {
    groups = Mixing.findCombinations(palette, input);
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="empty-state">Something went sideways — try again.</p>';
    return;
  }
  const total =
    (groups.bases?.length || 0) +
    (groups.variations?.length || 0) +
    (groups.creative?.length || 0);
  if (!total) {
    container.innerHTML =
      '<p class="empty-state">Nothing close enough yet — try another hue word, or add tubes to the palette.</p>';
    return;
  }

  renderHueResults(groups);
}

function renderHueChips() {
  const chips = ["purple", "sage", "coral", "orange", "green", "gray"];
  const wrap = $("#hue-chips");
  chips.forEach((hue) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hue-chip";
    btn.textContent = hue;
    btn.addEventListener("click", () => {
      $$(".hue-chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      $("#hue-input").value = hue;
      runHueSearch();
    });
    wrap.appendChild(btn);
  });
}

function updateDetailActionButtons(c) {
  const kit = getActiveKit();
  const inKit = colorInActiveKit(c.id);
  const currentBtn = $("#sheet-current-btn");
  const kitName = kit?.name || "kit";
  currentBtn.textContent = inKit
    ? `★ Remove from ${kitName}`
    : `★ Add to ${kitName}`;
  currentBtn.classList.toggle("is-active", inKit);
}

function renderMixTipsHtml(tips) {
  return tips
    .map((tip) => {
      const partners = (tip.with || [])
        .map((pid) => {
          const col = palette.colors.find((x) => x.id === pid);
          if (!col) return escapeHtml(pid);
          return `<button type="button" class="mix-tip-link" data-color-id="${escapeHtml(pid)}">${escapeHtml(col.name_en)}</button>`;
        })
        .join('<span class="mix-tip-plus"> + </span>');
      const badge = tip.verified
        ? '<span class="mix-tip-badge verified">Verified</span>'
        : '<span class="mix-tip-badge guess">Ace\'s guess</span>';
      return `<li class="mix-tip-item">${badge}<p class="mix-tip-formula">${partners}</p><p class="mix-tip-result">${escapeHtml(tip.result)}</p></li>`;
    })
    .join("");
}

function bindMixTipLinks(container) {
  container.querySelectorAll(".mix-tip-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const col = palette.colors.find((x) => x.id === btn.dataset.colorId);
      if (col) openDetail(col);
    });
  });
}

function openDetail(c) {
  detailColor = c;
  const sheet = $("#detail-sheet");
  const swatchEl = $("#sheet-swatch");
  swatchEl.style.background = c.hex;
  swatchEl.innerHTML = swatchMarksHtml(c);
  $("#sheet-brand").textContent = c.brand;
  $("#sheet-name-en").textContent = c.name_en;
  $("#sheet-name-zh").textContent = c.name_zh;
  $("#sheet-notes").textContent = c.notes ? `Source: ${c.notes}` : "";

  const sisters = findColorVariants(c).filter((x) => x.id !== c.id);
  const variantsEl = $("#sheet-variants");
  const chipsEl = $("#sheet-variant-chips");
  if (sisters.length) {
    variantsEl.hidden = false;
    chipsEl.innerHTML = sisters
      .map((s) => {
        const label = inventoryLabelText(s);
        return `<button type="button" class="variant-chip" data-color-id="${escapeHtml(s.id)}">
          <span class="variant-chip-swatch" style="background:${s.hex}" aria-hidden="true">${swatchMarksHtml(s)}</span>
          <span class="variant-chip-label">${escapeHtml(label)}</span>
        </button>`;
      })
      .join("");
    chipsEl.querySelectorAll(".variant-chip").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const col = palette.colors.find((x) => x.id === btn.dataset.colorId);
        if (col) openDetail(col);
      });
    });
  } else {
    variantsEl.hidden = true;
    chipsEl.innerHTML = "";
  }

  const bestForEl = $("#sheet-best-for");
  if (c.best_for) {
    bestForEl.hidden = false;
    $("#sheet-best-for-text").textContent = c.best_for;
  } else {
    bestForEl.hidden = true;
  }

  const aceEl = $("#sheet-ace-note");
  if (c.ace_note) {
    aceEl.hidden = false;
    $("#sheet-ace-text").textContent = c.ace_note;
  } else {
    aceEl.hidden = true;
  }

  const historyEl = $("#sheet-ace-history");
  if (c.ace_history) {
    historyEl.hidden = false;
    $("#sheet-ace-history-text").textContent = c.ace_history;
  } else {
    historyEl.hidden = true;
  }

  const mixTipsEl = $("#sheet-mix-tips");
  const tips = c.mix_tips || [];
  if (tips.length) {
    mixTipsEl.hidden = false;
    const list = $("#sheet-mix-tips-list");
    list.innerHTML = renderMixTipsHtml(tips);
    bindMixTipLinks(list);
  } else {
    mixTipsEl.hidden = true;
    $("#sheet-mix-tips-list").innerHTML = "";
  }

  const tox = toxicityLevel(c);
  const brandVariants = palette.colors.filter((x) => brandNameKey(x) === brandNameKey(c));
  const formatSpec = uniqueFormatTexts(brandVariants).join(", ") || formatDisplayText(c) || null;
  const specs = [
    ["Format", formatSpec],
    ["Family", c.family],
    ["Product code", c.code],
    [
      "Pigment",
      c.pigment
        ? `<span class="spec-pigment-value">${escapeHtml(c.pigment)}</span>${toxicityLightHtml(tox)}`
        : null,
      true,
    ],
    ["Transparency", Mixing.TRANSPARENCY_LABELS[c.transparency] || "—"],
    ["Lightfastness", Mixing.LIGHTFAST_LABELS[c.lightfastness] || "—"],
  ];

  $("#sheet-specs").innerHTML = specs
    .filter(([, v]) => v)
    .map(([k, v, isHtml]) =>
      isHtml
        ? `<dt>${k}</dt><dd class="spec-pigment-row">${v}</dd>`
        : `<dt>${k}</dt><dd>${escapeHtml(v || "—")}</dd>`
    )
    .join("");

  const habitEl = $("#sheet-toxicity-habit");
  if (c.toxicity_habit && tox !== "low") {
    habitEl.hidden = false;
    habitEl.textContent = c.toxicity_habit;
    habitEl.className = `toxicity-habit toxicity-habit-${tox}`;
  } else {
    habitEl.hidden = true;
    habitEl.textContent = "";
  }

  const traits = [];
  if (c.user_added) traits.push({ label: "Added by you", cls: "" });
  if (c.granulating) traits.push({ label: "Granulating", cls: "granulating" });
  if (c.staining) traits.push({ label: "Staining", cls: "staining" });
  (c.brand_traits || []).forEach((t) => {
    if (t === "user") return;
    traits.push({ label: t, cls: "" });
  });

  $("#sheet-traits").innerHTML = traits
    .map((t) => `<span class="trait ${t.cls}">${escapeHtml(t.label)}</span>`)
    .join("");

  updateDetailActionButtons(c);
  sheet.showModal();
}

async function loadBrandStories() {
  try {
    const res = await fetch(`data/brands.json?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const studioBrands = new Set(palette.colors.map((c) => c.brand));
    brandStories = (data.brands || []).filter((b) => studioBrands.has(b.name));
    if (!selectedBrandId || !brandStories.some((b) => b.id === selectedBrandId)) {
      selectedBrandId = brandStories[0]?.id || null;
    }
    renderBrandChips();
    renderBrandStory();
  } catch (err) {
    console.warn("Brand stories unavailable:", err);
  }
}

function brandColorCount(name) {
  return palette.colors.filter((c) => c.brand === name).length;
}

function renderBrandChips() {
  const wrap = $("#brand-chips");
  if (!wrap) return;
  if (!brandStories.length) {
    wrap.innerHTML = '<p class="empty-state">No brand stories for your current palette yet.</p>';
    return;
  }
  wrap.innerHTML = brandStories
    .map((b) => {
      const active = b.id === selectedBrandId;
      const count = brandColorCount(b.name);
      return `<button type="button" class="brand-chip${active ? " active" : ""}" data-brand-id="${escapeHtml(b.id)}" role="option" aria-selected="${active}">
        <span class="brand-chip-name">${escapeHtml(b.name)}</span>
        <span class="brand-chip-count">${count} color${count === 1 ? "" : "s"}</span>
      </button>`;
    })
    .join("");
}

function brandPaletteStripeHtml(brandName, customHexes) {
  const hexes =
    Array.isArray(customHexes) && customHexes.length
      ? customHexes
      : Mixing.sortBySpectrum(palette.colors.filter((c) => c.brand === brandName))
          .slice(0, 6)
          .map((c) => c.hex);
  const spans =
    hexes.length > 0
      ? hexes.map((hex) => `<span style="background:${escapeHtml(hex)}"></span>`).join("")
      : `<span style="background:var(--blush)"></span><span style="background:var(--lavender)"></span><span style="background:var(--sage)"></span>`;
  return `<div class="painting-demo-palette" aria-hidden="true">${spans}</div>`;
}

function renderPaintingDemo(work, brandName, featuredArtistName) {
  const title = escapeHtml(work.title || "Untitled");
  const year = work.year ? escapeHtml(work.year) : "";
  const paintArtist = (work.artist || "").trim();
  const featured = (featuredArtistName || "").trim();
  // Featured painter may be living (brand hero); demo may be a public-domain cousin
  const cousin =
    paintArtist &&
    featured &&
    paintArtist.toLowerCase() !== featured.toLowerCase();
  const creditLine = cousin
    ? ["Public-domain cousin", paintArtist, year].filter(Boolean).join(" · ")
    : [paintArtist || featured, year].filter(Boolean).join(" · ");
  const creditHtml = creditLine
    ? `<p class="painting-demo-year">${escapeHtml(creditLine)}</p>`
    : "";
  const caption = work.caption
    ? `<p class="painting-demo-caption">${escapeHtml(work.caption)}</p>`
    : "";
  const localSrc = work.image_local || "";
  const remoteSrc = work.image || "";
  const primarySrc = localSrc || remoteSrc;
  const altArtist = paintArtist || featured;
  const alt = [work.title || "Untitled", altArtist, work.year].filter(Boolean).join(", ");
  let visual = "";
  if (primarySrc) {
    const fallback = brandPaletteStripeHtml(brandName, work.palette);
    visual = `<img src="${escapeHtml(primarySrc)}" alt="${escapeHtml(alt)}" class="painting-demo-img" loading="lazy" decoding="async" data-remote="${escapeHtml(remoteSrc)}" />
      <div class="painting-demo-fallback" hidden>${fallback}</div>`;
  } else if (Array.isArray(work.palette) && work.palette.length) {
    visual = brandPaletteStripeHtml(brandName, work.palette);
  } else {
    visual = brandPaletteStripeHtml(brandName);
  }
  return `<article class="painting-demo">
    <div class="painting-demo-visual">${visual}</div>
    <div class="painting-demo-info">
      <p class="painting-demo-title">${title}</p>
      ${creditHtml}
      ${caption}
    </div>
  </article>`;
}

function bindPaintingDemoImages(container) {
  container.querySelectorAll(".painting-demo-img").forEach((img) => {
    img.addEventListener("error", () => {
      const remote = img.dataset.remote || "";
      if (remote && remote !== img.src && img.dataset.triedRemote !== "1") {
        img.dataset.triedRemote = "1";
        img.src = remote;
        return;
      }
      const wrap = img.closest(".painting-demo-visual");
      if (!wrap) return;
      img.remove();
      const fallback = wrap.querySelector(".painting-demo-fallback");
      if (fallback) fallback.hidden = false;
    });
  });
}

function renderBrandStory() {
  const el = $("#brand-story");
  if (!el) return;
  const brand = brandStories.find((b) => b.id === selectedBrandId);
  if (!brand) {
    el.innerHTML = "";
    return;
  }
  const paragraphs = (brand.story || [])
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  const artists = (brand.artists || [])
    .map((artist) => {
      // Always feature the brand hero by name (Zbukvic, Castagnet, etc.)
      const works = (artist.works || [])
        .map((w) => renderPaintingDemo(w, brand.name, artist.name))
        .join("");
      return `<section class="brand-artist-block">
        <h3 class="brand-artist-name">${escapeHtml(artist.name)}</h3>
        <p class="brand-artist-note">${escapeHtml(artist.note || "")}</p>
        <div class="painting-demos">${works}</div>
      </section>`;
    })
    .join("");
  el.innerHTML = `
    <article class="brand-story-card">
      <header class="brand-story-head">
        <h3 class="brand-story-name">${escapeHtml(brand.name)}</h3>
        <p class="brand-story-meta">${escapeHtml(brand.origin || "")}</p>
        <p class="brand-story-tagline">${escapeHtml(brand.tagline || "")}</p>
      </header>
      <div class="brand-story-text">${paragraphs}</div>
      <div class="brand-story-actions">
        <button type="button" class="btn-ghost btn-compact" data-brand-palette="${escapeHtml(brand.name)}">View colors in Palette</button>
      </div>
    </article>
    ${artists}`;
  bindPaintingDemoImages(el);
}

function selectBrand(brandId) {
  if (!brandStories.some((b) => b.id === brandId)) return;
  selectedBrandId = brandId;
  renderBrandChips();
  renderBrandStory();
}

function openBrandInPalette(brandName) {
  $("#search").value = "";
  $("#brand-filter").value = brandName;
  $("#family-filter").value = "";
  $("#toxicity-filter").value = "";
  $("#format-filter").value = "";
  renderPalette();
  switchTab("palette");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetBrandsPanel() {
  renderBrandStory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetPalettePanel() {
  $("#search").value = "";
  $("#brand-filter").value = "";
  $("#family-filter").value = "";
  $("#toxicity-filter").value = "";
  $("#format-filter").value = "";
  const sheet = $("#detail-sheet");
  if (sheet.open) sheet.close();
  renderPalette();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetMixPanel() {
  ensureMixPicker();
  $("#hue-input").value = "";
  $("#hue-results").innerHTML = "";
  clearInlineHueColorInfo();
  $$(".hue-chip").forEach((c) => c.classList.remove("active"));
  selectedMixSlots = [null, null, null];
  mixPickerStarsOnly = false;
  setActiveColorLinks(null);
  renderMixPicker();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetKitsPanel() {
  const sheet = $("#detail-sheet");
  if (sheet?.open) sheet.close();
  const picker = $("#kit-picker-sheet");
  if (picker?.open) picker.close();
  renderKits();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAddPanel() {
  if (!editingColorId) return;
  fillColorForm(null);
  clearFormStatus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function resetSyncPanel() {
  const passInput = $("#sync-passphrase");
  if (passInput) passInput.value = getSavedPassphrase();
  await refreshSyncPanel();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isMoreSubpanel(tabName) {
  return tabName === "brands" || tabName === "add" || tabName === "sync";
}

function moreSubpanelOpen() {
  return (
    $("#panel-brands").classList.contains("active") ||
    $("#panel-add").classList.contains("active") ||
    $("#panel-sync").classList.contains("active")
  );
}

function switchTab(tabName) {
  $$(".tab").forEach((t) => {
    const tab = t.dataset.tab;
    const active = tab === tabName || (tab === "more" && isMoreSubpanel(tabName));
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
  });
  $$(".panel").forEach((p) => {
    const active = p.id === `panel-${tabName}`;
    p.classList.toggle("active", active);
    p.hidden = !active;
  });
}

function openMoreTarget(target) {
  if (target === "brands") resetBrandsPanel();
  if (target === "add" && !editingColorId) {
    fillColorForm(null);
    clearFormStatus();
  }
  if (target === "sync") void resetSyncPanel();
  switchTab(target);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      const alreadyActive = tab.classList.contains("active");
      if (tabName === "more") {
        if (moreSubpanelOpen()) {
          switchTab("more");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (alreadyActive) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        switchTab("more");
        return;
      }
      if (alreadyActive) {
        if (tabName === "palette") resetPalettePanel();
        if (tabName === "kits") resetKitsPanel();
        if (tabName === "mix") resetMixPanel();
        return;
      }
      if (tabName === "palette") resetPalettePanel();
      if (tabName === "kits") resetKitsPanel();
      if (tabName === "mix") resetMixPanel();
      switchTab(tabName);
    });
  });

  $$("[data-more-target]").forEach((btn) => {
    btn.addEventListener("click", () => openMoreTarget(btn.dataset.moreTarget));
  });

  $("#search").addEventListener("input", renderPalette);
  $("#brand-filter").addEventListener("change", renderPalette);
  $("#family-filter").addEventListener("change", renderPalette);
  $("#toxicity-filter").addEventListener("change", renderPalette);
  $("#format-filter").addEventListener("change", renderPalette);
  $("#todays-shuffle").addEventListener("click", shuffleTodaysPalette);
  $("#mix-clear").addEventListener("click", () => {
    selectedMixSlots = [null, null, null];
    renderMixPicker();
  });
  $("#mix-stars-toggle").addEventListener("click", () => {
    mixPickerStarsOnly = !mixPickerStarsOnly;
    renderMixPicker();
  });
  $("#hue-search-btn").addEventListener("click", runHueSearch);
  $("#hue-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") runHueSearch();
  });

  $("#sheet-current-btn").addEventListener("click", () => {
    if (!detailColor) return;
    if (colorInActiveKit(detailColor.id)) removeFromActiveKit(detailColor.id);
    else addToActiveKit(detailColor.id);
  });

  $("#kit-add-btn")?.addEventListener("click", createNewKit);
  $("#kit-arrange-btn")?.addEventListener("click", arrangeActiveKitSpectrum);
  $("#kit-rename-btn")?.addEventListener("click", renameActiveKit);
  $("#kit-delete-btn")?.addEventListener("click", deleteActiveKit);
  $("#kit-notes")?.addEventListener("change", () => {
    const kit = getActiveKit();
    if (!kit) return;
    kit.notes = $("#kit-notes").value;
    saveKits();
  });
  $("#kit-picker-close")?.addEventListener("click", () => {
    kitFillSlotIndex = null;
    $("#kit-picker-sheet").close();
  });
  $("#kit-picker-search")?.addEventListener("input", renderKitPickerGrid);
  $("#sheet-remove-btn").addEventListener("click", () => {
    if (!detailColor) return;
    removeColorFromStudio(detailColor.id);
  });
  $("#sheet-edit-btn").addEventListener("click", () => {
    if (!detailColor) return;
    startEditColor(detailColor);
  });
  $("#color-form").addEventListener("submit", saveColorFromForm);
  $("#color-form-cancel").addEventListener("click", () => {
    fillColorForm(null);
    clearFormStatus();
    switchTab("palette");
  });
  $("#f-hex-picker").addEventListener("input", () => {
    $("#f-hex").value = $("#f-hex-picker").value.toUpperCase();
  });
  $("#f-hex").addEventListener("input", () => {
    const v = $("#f-hex").value.trim();
    const hex = v.startsWith("#") ? v : `#${v}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) $("#f-hex-picker").value = hex;
  });
  $("#sheet-close").addEventListener("click", () => {
    detailColor = null;
    $("#detail-sheet").close();
  });
  $("#detail-sheet").addEventListener("click", (e) => {
    if (e.target === $("#detail-sheet")) {
      detailColor = null;
      $("#detail-sheet").close();
    }
  });

  $("#sync-save-passphrase").addEventListener("click", saveSyncPassphrase);
  $("#sync-now-btn").addEventListener("click", syncNow);
  $("#sync-export-btn").addEventListener("click", exportStudioFile);
  $("#sync-import-input").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) importStudioFile(file);
    e.target.value = "";
  });

  $("#brand-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".brand-chip");
    if (!chip?.dataset.brandId) return;
    selectBrand(chip.dataset.brandId);
  });

  $("#brand-story").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-brand-palette]");
    if (!btn) return;
    openBrandInPalette(btn.dataset.brandPalette);
  });
}

function granuleMarkHtml() {
  return '<span class="granule-mark" title="Granulating">✦</span>';
}

function mixStarMarkHtml() {
  return '<span class="mix-mark" title="Great for mixing">◈</span>';
}

function swatchMarksHtml(c) {
  let html = "";
  if (c.granulating) html += granuleMarkHtml();
  if (c.mix_star) html += mixStarMarkHtml();
  if (!html) return "";
  return `<span class="swatch-marks">${html}</span>`;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

init();