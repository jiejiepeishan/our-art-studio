const STORAGE = StudioData.STORAGE;

/** Live studio state — search `state.` to see reads/writes (step 2). */
const state = {
  palette: { colors: [] },
  basePalette: { colors: [] },
  selectedMixSlots: [null, null, null],
  mixPickerBuilt: false,
  mixPickerStarsOnly: false,
  variantIndex: new Map(),
  detailColor: null,
  editingColorId: null,
  creativePoolKitIds: [],
  creativeMode: "play", // play | mix | temp | complement
  creativeDrawIds: [],
  userData: { removed: [], added: [], overrides: {} },
  kits: [],
  activeKitId: null,
  kitFillSlotIndex: null,
  kitWheel: { a: null, b: null, nextTap: "a", drag: null },
  kitWellEditMode: false,
  waterLabColorId: null,
  practiceShuffleNonce: 0,
  paletteReadOpenOverride: null,
  paletteReadKitId: null,
  syncApiAvailable: false,
  skipNextSyncPush: false,
  syncPushTimer: null,
  localSyncRevision: 0,
  brandStories: [],
  selectedBrandId: null,
};

const SYNC_BUNDLE_VERSION = StudioData.SYNC_BUNDLE_VERSION;
/** Soft ceiling so a kit doesn’t grow forever; wells are added/removed on the fly */
const KIT_SLOT_MAX = 36;
/** Bump with sw.js CACHE (+ index chip) when shipping UI/data */
const APP_VERSION = "147";

/** Resolve assets for GitHub project pages and local server */
function appBasePath() {
  let p = location.pathname || "/";
  if (/\.html?$/i.test(p)) p = p.replace(/[^/]+$/, "");
  else if (!p.endsWith("/")) p += "/";
  return p;
}
function assetUrl(rel) {
  return appBasePath() + String(rel || "").replace(/^\.\//, "");
}

/** Home kit capacity (32 pans — no empty wells) */
const HOME_TIN = { total: 32 };

/** Prefill from studio home kit card (confirmed Jul 2026) */
const HOME_DEFAULT_SLOTS = [
  "mb-naples-yellow", // MaimeriBlu 104 Naples Yellow
  "ds-15ml-hot-mulled-cider-yellow",
  "wn-tube-tyrian-purple",
  "mg-020-burnt-sienna",
  "ds-128-prussian-green",
  "sch-923-desert-brown",
  "wn-273",
  "ds-15ml-candy-cane-red",
  "ds-15ml-christmas-tree-green",
  "rosa-747",
  "wn-tube-quin-red",
  "mb-potters-pink",
  "sch-hp-940-brilliant-red-violet",
  "sch-hp-667-raw-umber",
  "sch-482-delft",
  "mg-193-ultramarine-violet",
  "wn-745", // White Nights May Green
  "rosa-755", // Grass Green
  "wn-tube-winsor-blue-gs",
  "wn-tube-paynes-gray",
  "ds-237-rose-madder",
  "wn-609",
  "ds-burnt-sienna",
  "rosa-761", // Golden Brown
  "ds-034-french-ultramarine",
  "wn-559",
  "wn-555",
  "sch-932-shire-olive", // Shire Green / Olive 932
  "ds-undersea-green",
  "sch-924-desert-green",
  "ds-174-royal-purple",
  "ds-moonglow",
];

function setActiveKit(id) {
  state.activeKitId = id;
  state.kitWellEditMode = false;
  state.paletteReadOpenOverride = null;
  state.paletteReadKitId = id || null;
  state.kitWheel.a = null;
  state.kitWheel.b = null;
  state.kitWheel.drag = null;
  state.waterLabColorId = null;
}

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

/** Fetch with timeout so a hung network never freezes “Loading studio…” */
async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function init() {
  try {
  const res = await fetchWithTimeout(
    assetUrl(`data/palette.json?v=${Date.now()}`),
    { cache: "no-store" },
    10000
  );
  if (!res.ok) throw new Error(`Could not load palette (${res.status})`);
  state.basePalette = await res.json();
  if (!state.basePalette.colors || !state.basePalette.colors.length) {
    throw new Error("Palette is empty");
  }
  state.palette =
    typeof structuredClone === "function"
      ? structuredClone(state.basePalette)
      : JSON.parse(JSON.stringify(state.basePalette));
  loadUserData();
  applyUserChanges();

  const nameEl = $("#studio-name");
  const nameZhEl = $("#studio-name-zh");
  if (nameEl) nameEl.textContent = state.palette.studio_name || "Our Art Studio";
  if (nameZhEl) nameZhEl.textContent = state.palette.studio_name_zh || "";
  updatePaletteMeta();
  renderCaveats();
  buildVariantIndex();

  loadUserLists();
  loadKits();
  rebuildFilters();
  initVersionChip();
  loadCreativeFunState();

  // Paint the UI first — never leave “Loading studio…” up for brands/sync
  try {
    renderPalette();
  } catch (e) {
    console.warn("renderPalette", e);
  }
  try {
    renderKits();
  } catch (e) {
    console.warn("renderKits", e);
  }
  try {
    renderCreativeFun();
  } catch (e) {
    console.warn("renderCreativeFun", e);
  }
  try {
    updateTabBadges();
    renderHueChips();
  } catch (e) {
    console.warn("badges/hue", e);
  }
  try {
    bindEvents();
  } catch (e) {
    console.warn("bindEvents", e);
  }
  // SW disabled for stability on GitHub Pages (was causing stuck loads / reload loops)
  disableServiceWorkers();
  hideLoadStatus();

  // Secondary loads after paint (must not block)
  loadBrandStories().catch((e) => console.warn("brands", e));
  initStudioSync().catch((e) => console.warn("sync", e));
  } catch (err) {
    console.error(err);
    showLoadError(
      "Could not load the studio: " +
        (err && err.name === "AbortError"
          ? "Request timed out — check network."
          : err && err.message
            ? err.message
            : String(err))
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

/** Unregister SW everywhere — emergency stability mode for live site */
function disableServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => Promise.all(regs.map((r) => r.unregister())))
    .catch(() => {});
  if (window.caches?.keys) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .catch(() => {});
  }
}

function registerServiceWorker() {
  // Intentionally no-op while we stabilize GitHub Pages loads.
  // Call disableServiceWorkers() from init instead.
  disableServiceWorkers();
}

/** Hard refresh path for stuck PWA caches (version chip) */
async function forceAppRefresh() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if (window.caches?.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* still reload */
  }
  const url = new URL(window.location.href);
  url.searchParams.set("v", APP_VERSION);
  url.searchParams.set("_", String(Date.now()));
  window.location.replace(url.toString());
}

function initVersionChip() {
  const chip = $("#app-version-chip");
  if (!chip) return;
  chip.textContent = `v${APP_VERSION}`;
  chip.title = "Tap to fetch the latest studio (clears cache)";
  chip.addEventListener("click", () => {
    chip.textContent = "Updating…";
    chip.disabled = true;
    forceAppRefresh();
  });
}

function renderCaveats() {
  const list = $("#caveats-list");
  const banner = $("#caveats-banner");
  const items = state.palette.caveats || [];
  if (!list) return;
  if (!items.length) {
    if (banner) banner.hidden = true;
    return;
  }
  list.innerHTML = items.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  $("#caveats-toggle")?.addEventListener("click", () => {
    const btn = $("#caveats-toggle");
    if (!btn) return;
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    list.hidden = open;
  });
}

function updatePaletteMeta() {
  const meta = $("#palette-meta");
  if (!meta) return;
  const base = `${state.palette.colors.length} colors`;
  const custom = state.userData.added.length;
  const edited = Object.keys(state.userData.overrides).length;
  const bits = [base];
  if (custom) bits.push(`${custom} yours`);
  if (edited) bits.push(`${edited} edited`);
  bits.push(`updated ${state.palette.updated || state.basePalette.updated || "today"}`);
  meta.textContent = bits.join(" · ");
}

function resetFilterSelect(sel, firstLabel) {
  sel.innerHTML = `<option value="">${firstLabel}</option>`;
}

function populateBrandFilter() {
  const brands = [...new Set(state.palette.colors.map((c) => c.brand))].sort();
  const sel = $("#brand-filter");
  if (!sel) return;
  brands.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    sel.appendChild(opt);
  });
}

function populateFamilyFilter() {
  const sel = $("#family-filter");
  const families = [...new Set(state.palette.colors.map((c) => c.family).filter(Boolean))].sort();
  families.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    sel.appendChild(opt);
  });
  const granCount = state.palette.colors.filter((c) => c.granulating).length;
  if (granCount) {
    const gran = document.createElement("option");
    gran.value = "_granulating";
    gran.textContent = `✦ Granulating (${granCount})`;
    sel.appendChild(gran);
  }
  const mixCount = state.palette.colors.filter((c) => c.mix_star).length;
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
      (state.palette.colors || [])
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
  if (
    f === "full pan" ||
    f.includes("full pan") ||
    f.includes("full-pan") ||
    f === "single pan" ||
    f.includes("single pan") ||
    f === "pan"
  ) {
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
  if (f.includes("half-pan") || f.includes("half pan")) cats.add("half-pan");
  // full pan, single pan (Rosa etc.), bare pan, or compound "pan, 5ml tube"
  if (
    f.includes("full pan") ||
    f.includes("full-pan") ||
    f.includes("single pan") ||
    f === "pan" ||
    /^pan\b/.test(f) ||
    /,\s*pan\b/.test(f)
  ) {
    cats.add("pan");
  }
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
  state.palette.colors.forEach((c) => {
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
  const raw = ($("#search")?.value || "").trim().toLowerCase();
  const tokens = raw.split(/[\s,]+/).filter(Boolean);
  const brand = $("#brand-filter").value;
  const family = $("#family-filter").value;
  const toxicity = $("#toxicity-filter")?.value || "";
  const format = $("#format-filter")?.value || "";
  const filtered = state.palette.colors.filter((c) => {
    if (brand && c.brand !== brand) return false;
    if (family === "_granulating") {
      if (!c.granulating) return false;
    } else if (family === "_mix_star") {
      if (!c.mix_star) return false;
    } else if (family && c.family !== family) return false;
    if (toxicity && toxicityLevel(c) !== toxicity) return false;
    if (!matchesFormatFilter(c, format)) return false;
    // Same multi-token AND search as kit picker (code · hue · brand · name)
    if (tokens.length && !colorMatchesSearchTokens(c, tokens)) return false;
    return true;
  });
  return Mixing.sortBySpectrum(filtered);
}

function loadStoredIds(key) {
  return StudioData.loadStoredIds(key);
}

function saveStoredIds(key, ids) {
  StudioData.saveStoredIds(key, ids);
}

function loadUserData() {
  state.userData = StudioData.loadUserData();
}

function saveUserData() {
  StudioData.saveUserData(state.userData);
}

function mergeColorEntry(base, override) {
  return StudioData.mergeColorEntry(base, override);
}

function applyUserChanges() {
  const next = StudioData.applyUserChanges(state.basePalette, state.userData);
  state.palette.colors = next.colors;
  state.palette.color_count = next.color_count;
}

function persistPaletteChanges() {
  saveUserData();
  applyUserChanges();
  buildVariantIndex();
  updatePaletteMeta();
  rebuildFilters();
  state.mixPickerBuilt = false;
  loadUserLists();
  loadKits();
  renderPalette();
  renderKits();
  updateTabBadges();
  if ($("#panel-mix").classList.contains("active")) ensureMixPicker();
  if (state.brandStories.length) renderBrandChips();
  if (!state.skipNextSyncPush) scheduleSyncPush();
  state.skipNextSyncPush = false;
}

function buildSyncBundle() {
  state.localSyncRevision += 1;
  return StudioData.buildSyncBundle({
    userData: state.userData,
    kits: state.kits,
    activeKitId: state.activeKitId,
    revision: state.localSyncRevision,
  });
}

function applySyncBundle(bundle) {
  const next = StudioData.readSyncBundle(bundle);
  if (!next) return false;
  state.userData = next.userData;
  if (next.kits) {
    state.kits = next.kits.map(normalizeKit);
    state.activeKitId = next.activeKitId || state.kits[0]?.id || null;
    saveKits();
  }
  if (next.revision) state.localSyncRevision = Math.max(state.localSyncRevision, next.revision);
  if (next.updatedAt) StudioData.setLastSyncedAt(next.updatedAt);
  state.skipNextSyncPush = true;
  persistPaletteChanges();
  return true;
}

function sha256HexBytes(bytes) {
  return StudioData.sha256HexBytes(bytes);
}

function hashPassphrase(passphrase) {
  return StudioData.hashPassphrase(passphrase);
}

function getSavedPassphrase() {
  return StudioData.getSavedPassphrase();
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
  if (state.syncApiAvailable) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.textContent = "Server not connected — auto-sync is off right now.";
  el.hidden = false;
}

function applySyncStatusLine() {
  const saved = getSavedPassphrase();
  const last = StudioData.getLastSyncedAt();
  if (state.syncApiAvailable && saved) {
    setSyncStatus(`Auto-sync on · last ${formatSyncTime(last)}`, "ok");
  } else if (state.syncApiAvailable) {
    setSyncStatus("Auto-sync ready — set a passphrase on each device.", "ok");
  } else {
    setSyncStatus("Not syncing right now — your changes stay on this device until the server is back.", "warn");
  }
}

async function refreshSyncPanel() {
  state.syncApiAvailable = await checkSyncApi();
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
  if (!state.syncApiAvailable) {
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
    const localAt = Number(StudioData.getLastSyncedAt() || 0);
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
  if (!state.syncApiAvailable) {
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
    StudioData.setLastSyncedAt(bundle.updatedAt);
    if (!quiet) setSyncStatus(`Synced at ${formatSyncTime(bundle.updatedAt)}.`, "ok");
    return true;
  } catch (err) {
    if (!quiet) setSyncStatus(`Sync push failed: ${err.message}`, "error");
    return false;
  }
}

function scheduleSyncPush() {
  if (!getSavedPassphrase() || !state.syncApiAvailable) return;
  clearTimeout(state.syncPushTimer);
  state.syncPushTimer = setTimeout(() => {
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
    if (state.syncApiAvailable && saved) {
      await pullRemoteSync({ quiet: true });
      applySyncStatusLine();
    }
  } catch (err) {
    console.warn("Studio sync init failed:", err);
    state.syncApiAvailable = false;
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
      softConfirm(msg).then((ok) => {
        if (!ok) return;
        applySyncBundle(bundle);
        setSyncStatus(`Imported from file (${formatSyncTime(bundle.updatedAt)}).`, "ok");
        showToast("Studio imported", { type: "ok" });
        if (state.syncApiAvailable && getSavedPassphrase()) pushRemoteSync({ quiet: true });
      });
    } catch (err) {
      setSyncStatus(`Import failed: ${err.message}`, "error");
      showToast("Import failed", { type: "error" });
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
  StudioData.savePassphrase(phrase);
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
  const taken = new Set(state.palette.colors.map((c) => c.id));
  state.userData.added.forEach((c) => taken.add(c.id));
  let n = 2;
  while (taken.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

function isUserAddedColor(id) {
  return state.userData.added.some((c) => c.id === id);
}

function getEditableColor(id) {
  const added = state.userData.added.find((c) => c.id === id);
  if (added) return { ...added };
  const base = state.basePalette.colors.find((c) => c.id === id);
  if (!base) return null;
  return mergeColorEntry(base, state.userData.overrides[id]);
}

async function removeColorFromStudio(id) {
  const name = state.palette.colors.find((c) => c.id === id)?.name_en || id;
  const msg = `Remove “${name}” from your studio? You can add it again later from Add Color.`;
  if (!(await softConfirm(msg))) return;

  if (isUserAddedColor(id)) {
    state.userData.added = state.userData.added.filter((c) => c.id !== id);
  } else {
    if (!state.userData.removed.includes(id)) state.userData.removed.push(id);
    delete state.userData.overrides[id];
  }

  removeColorIdFromAllKits(id);
  state.selectedMixSlots = state.selectedMixSlots.map((x) => (x === id ? null : x));
  compactMixSlots();

  persistPaletteChanges();
  state.detailColor = null;
  $("#detail-sheet").close();
  showToast(`Removed “${name}”`, { type: "ok" });
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
    state.editingColorId = null;
    $("#color-form").reset();
    $("#f-hex-picker").value = "#888888";
    $("#f-toxicity").value = "low";
    $("#add-form-title").textContent = "Add a new color";
    $("#add-form-hint").textContent =
      "Enter what’s on the tube or pan label. Saves on this device — great for new paints before they’re in the master list.";
    $("#color-form-submit").textContent = "Save color";
    $("#color-form-cancel").hidden = true;
    updateFormSwatchPreview();
    return;
  }
  state.editingColorId = c.id;
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
  updateFormSwatchPreview();
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

  if (state.editingColorId) {
    if (isUserAddedColor(state.editingColorId)) {
      const idx = state.userData.added.findIndex((c) => c.id === state.editingColorId);
      if (idx >= 0) {
        state.userData.added[idx] = { ...state.userData.added[idx], ...data, id: state.editingColorId, user_added: true };
      }
    } else {
      const base = state.basePalette.colors.find((c) => c.id === state.editingColorId);
      if (!base) {
        showFormStatus("Could not find that color to edit.", true);
        return;
      }
      const override = { ...data };
      Object.keys(override).forEach((k) => {
        if (override[k] === base[k]) delete override[k];
      });
      if (Object.keys(override).length) state.userData.overrides[state.editingColorId] = override;
      else delete state.userData.overrides[state.editingColorId];
    }
    persistPaletteChanges();
    const updated = state.palette.colors.find((c) => c.id === state.editingColorId);
    showFormStatus(`Updated “${updated?.name_en || data.name_en}”.`);
    showToast(`Updated “${updated?.name_en || data.name_en}”`, { type: "ok" });
    fillColorForm(null);
    if (updated) {
      switchTab("palette");
      openDetail(updated);
    }
    return;
  }

  const id = uniqueColorId(data.brand, data.name_en, data.code);
  state.userData.added.push({ ...data, id, user_added: true });
  persistPaletteChanges();
  showFormStatus(`Added “${data.name_en}” to your studio.`);
  showToast(`Added “${data.name_en}”`, { type: "ok" });
  fillColorForm(null);
  switchTab("palette");
  const created = state.palette.colors.find((c) => c.id === id);
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
  StudioData.clearLegacyLists();
}

function uid(prefix = "kit") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeKit(raw) {
  // Flexible wells: size = colors you keep. Drop empty pads from older fixed-size kits.
  const rawSlots = Array.isArray(raw.slots) ? raw.slots : [];
  const slots = rawSlots
    .map((id) => (id && state.palette.colors.some((c) => c.id === id) ? id : null))
    .filter(Boolean)
    .slice(0, KIT_SLOT_MAX);
  // Personal note is locked for the user; migrate legacy `notes` if needed
  let personalNote = "";
  if (typeof raw.personalNote === "string" && raw.personalNote.trim()) {
    personalNote = raw.personalNote;
  } else if (typeof raw.notes === "string" && raw.notes.trim()) {
    personalNote = raw.notes;
  }
  return {
    id: raw.id || uid(),
    name: (raw.name || "Kit").trim() || "Kit",
    layout: raw.layout === "home-tin" ? "home-tin" : "grid",
    slots,
    personalNote,
    // Mirror for older export/import readers that only knew `notes`
    notes: personalNote,
    orderMode: raw.orderMode === "spectrum" ? "spectrum" : "manual",
  };
}

function makeHomeKit() {
  const slots = HOME_DEFAULT_SLOTS.map((id) =>
    id && state.palette.colors.some((c) => c.id === id) ? id : null
  ).filter(Boolean);
  // Keep length at 32; pad only if some defaults missing from catalog
  while (slots.length < HOME_TIN.total) slots.push(null);
  return {
    id: "kit-home",
    name: "Home",
    layout: "grid",
    slots: slots.slice(0, HOME_TIN.total),
    personalNote: "",
    notes: "",
    orderMode: "spectrum",
  };
}

function saveKits() {
  StudioData.saveKits(state.kits, state.activeKitId);
}

function loadKits() {
  const valid = new Set(state.palette.colors.map((c) => c.id));
  const loaded = StudioData.loadKitsRaw();
  if (!Array.isArray(loaded) || !loaded.length) {
    state.kits = [makeHomeKit()];
    state.activeKitId = state.kits[0].id;
    saveKits();
    return;
  }
  state.kits = loaded.map((k) => {
    const n = normalizeKit(k);
    // Drop missing/invalid colors entirely (no empty pad wells)
    n.slots = n.slots.filter((id) => id && valid.has(id));
    return n;
  });
  // Refresh Home kit: 32 wells, drop empty padding, apply known remaps
  const home = state.kits.find((k) => k.id === "kit-home" || k.name === "Home");
  if (home) {
    let patched = false;
    home.layout = "grid";
    home.slots = home.slots.map((id) => {
      if (id === "mg-104" && valid.has("mb-naples-yellow")) {
        patched = true;
        return "mb-naples-yellow";
      }
      return id && valid.has(id) ? id : null;
    });
    // Prefer filled wells only; cap at 32
    const filled = home.slots.filter(Boolean);
    const target = HOME_DEFAULT_SLOTS.map((id) =>
      id && valid.has(id) ? id : null
    ).filter(Boolean);
    // Merge: keep user order for filled, add any missing defaults not already in kit
    const have = new Set(filled);
    target.forEach((id) => {
      if (!have.has(id)) {
        filled.push(id);
        have.add(id);
        patched = true;
      }
    });
    const next = filled.slice(0, HOME_TIN.total);
    if (
      next.length !== home.slots.length ||
      next.some((id, i) => id !== home.slots[i]) ||
      home.slots.some((id) => !id)
    ) {
      home.slots = next;
      patched = true;
    }
    // Keep personal notes; only clear empty legacy mirror field noise
    if (home.notes && !home.personalNote) {
      home.personalNote = home.notes;
      patched = true;
    }
    if (patched) saveKits();
  }
  const savedActive = StudioData.loadActiveKitId();
  state.activeKitId =
    state.kits.find((k) => k.id === savedActive)?.id || state.kits[0]?.id || null;
}

function getActiveKit() {
  return state.kits.find((k) => k.id === state.activeKitId) || state.kits[0] || null;
}

function removeColorIdFromAllKits(id) {
  let changed = false;
  state.kits.forEach((k) => {
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

/* —— Soft toasts & confirms —— */
function showToast(message, { type = "info", duration = 2800 } = {}) {
  const host = $("#toast-host");
  if (!host || !message) return;
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 280);
  }, duration);
}

function softConfirm(message) {
  return new Promise((resolve) => {
    const host = $("#confirm-host");
    if (!host) {
      resolve(window.confirm(message));
      return;
    }
    host.hidden = false;
    host.innerHTML = `
      <div class="confirm-card" role="dialog" aria-modal="true" aria-label="Confirm">
        <p>${escapeHtml(message)}</p>
        <div class="confirm-actions">
          <button type="button" class="btn-ghost btn-compact" data-confirm="no">Cancel</button>
          <button type="button" class="btn-primary btn-compact" data-confirm="yes">OK</button>
        </div>
      </div>`;
    const finish = (val) => {
      host.hidden = true;
      host.innerHTML = "";
      resolve(val);
    };
    host.querySelector('[data-confirm="yes"]').addEventListener("click", () => finish(true));
    host.querySelector('[data-confirm="no"]').addEventListener("click", () => finish(false));
    host.addEventListener(
      "click",
      (e) => {
        if (e.target === host) finish(false);
      },
      { once: true }
    );
  });
}

/* —— Creative Fun (kit-scoped limited draws) —— */
function loadCreativeFunState() {
  const raw = StudioData.loadCreativeFunRaw();
  if (raw?.mode) state.creativeMode = raw.mode;
  if (Array.isArray(raw?.poolKitIds)) state.creativePoolKitIds = raw.poolKitIds.filter(Boolean);
  if (Array.isArray(raw?.ids) && raw.ids.length === 3) state.creativeDrawIds = raw.ids;
  // Ensure pool defaults to active kit when empty/invalid
  const valid = new Set(state.kits.map((k) => k.id));
  state.creativePoolKitIds = state.creativePoolKitIds.filter((id) => valid.has(id));
  if (!state.creativePoolKitIds.length && state.activeKitId) state.creativePoolKitIds = [state.activeKitId];
  if (!state.creativePoolKitIds.length && state.kits[0]) state.creativePoolKitIds = [state.kits[0].id];
}

function saveCreativeFunState() {
  StudioData.saveCreativeFunState({
    mode: state.creativeMode,
    poolKitIds: state.creativePoolKitIds,
    ids: state.creativeDrawIds,
    date: localDateKey(),
  });
}

function creativePoolColors() {
  const idSet = new Set();
  state.creativePoolKitIds.forEach((kid) => {
    const kit = state.kits.find((k) => k.id === kid);
    if (!kit) return;
    kit.slots.forEach((id) => {
      if (id) idSet.add(id);
    });
  });
  return [...idSet]
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
}

function hueBandWarmCool(c) {
  try {
    const { h, s } = Mixing.hexToHsl(c.hex);
    if (s < 12) return "neutral";
    // warm: red–yellow; cool: green–blue–violet
    if (h < 70 || h >= 330) return "warm";
    if (h >= 70 && h < 150) return "green";
    return "cool";
  } catch {
    return "neutral";
  }
}

function pickRandomFrom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function drawCreativeTrio(forceNew = false) {
  const pool = creativePoolColors();
  if (pool.length < 3) {
    state.creativeDrawIds = pool.map((c) => c.id);
    saveCreativeFunState();
    return pool;
  }

  if (!forceNew && state.creativeDrawIds.length === 3) {
    const kept = state.creativeDrawIds
      .map((id) => pool.find((c) => c.id === id))
      .filter(Boolean);
    if (kept.length === 3) return kept;
  }

  let picked = [];
  if (state.creativeMode === "mix") {
    const stars = pool.filter((c) => c.mix_star);
    const rest = pool.filter((c) => !c.mix_star);
    picked = pickRandomFrom(stars.length ? stars : pool, Math.min(2, stars.length || 2));
    const need = 3 - picked.length;
    const others = rest.filter((c) => !picked.includes(c));
    picked = picked.concat(pickRandomFrom(others.length ? others : pool.filter((c) => !picked.includes(c)), need));
  } else if (state.creativeMode === "temp") {
    const warm = pool.filter((c) => hueBandWarmCool(c) === "warm");
    const cool = pool.filter((c) => hueBandWarmCool(c) === "cool");
    if (warm.length && cool.length) {
      picked.push(pickRandomFrom(warm, 1)[0]);
      picked.push(pickRandomFrom(cool, 1)[0]);
      const rest = pool.filter((c) => !picked.includes(c));
      picked = picked.concat(pickRandomFrom(rest, 1));
    } else {
      picked = pickRandomFrom(pool, 3);
    }
  } else if (state.creativeMode === "complement") {
    const a = pickRandomFrom(pool, 1)[0];
    const target = (Mixing.hexToHsl(a.hex).h + 180) % 360;
    let best = null;
    let bestD = 999;
    pool.forEach((c) => {
      if (c.id === a.id) return;
      let d = Math.abs(Mixing.hexToHsl(c.hex).h - target);
      if (d > 180) d = 360 - d;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    });
    picked = [a];
    if (best) picked.push(best);
    const rest = pool.filter((c) => !picked.includes(c));
    picked = picked.concat(pickRandomFrom(rest, 3 - picked.length));
  } else {
    // play — pure random
    picked = pickRandomFrom(pool, 3);
  }

  // pad if short
  if (picked.length < 3) {
    const rest = pool.filter((c) => !picked.includes(c));
    picked = picked.concat(pickRandomFrom(rest, 3 - picked.length));
  }

  state.creativeDrawIds = picked.slice(0, 3).map((c) => c.id);
  saveCreativeFunState();
  return picked.slice(0, 3);
}

function creativeModeLabel(mode) {
  return (
    {
      play: "Play · pure random from your tin(s)",
      mix: "Mix practice · leans on ◈ good-for-mix pans",
      temp: "Warm + cool · temperature contrast",
      complement: "Complement · near-opposites for mute greys",
    }[mode] || ""
  );
}

function creativePoolSummary() {
  const names = state.creativePoolKitIds
    .map((id) => state.kits.find((k) => k.id === id)?.name)
    .filter(Boolean);
  if (!names.length) return "Select kits…";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} · ${names[1]}`;
  return `${names[0]} +${names.length - 1}`;
}

/** Kit names in the Creative Fun pool that hold this color id */
function creativeKitNamesForColor(colorId) {
  if (!colorId) return [];
  const names = [];
  state.creativePoolKitIds.forEach((kid) => {
    const kit = state.kits.find((k) => k.id === kid);
    if (!kit) return;
    if (kit.slots.includes(colorId)) names.push(kit.name);
  });
  return names;
}

function creativeColorCaption(c) {
  const bits = [c.name_en, c.brand].filter(Boolean);
  const kitNames = creativeKitNamesForColor(c.id);
  // When drawing from multiple kits, show where to find the pan
  if (state.creativePoolKitIds.length > 1 && kitNames.length) {
    bits.push(kitNames.join(" / "));
  } else if (state.creativePoolKitIds.length === 1 && kitNames[0]) {
    // Single kit still helpful as a quiet cue
    bits.push(kitNames[0]);
  }
  return bits.join(" · ");
}

function closeCreativeKitDropdown() {
  const panel = $("#creative-kit-dd");
  const btn = $("#creative-kit-dd-btn");
  if (panel) panel.hidden = true;
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function renderCreativeKitDropdown() {
  const panel = $("#creative-kit-dd");
  const btn = $("#creative-kit-dd-btn");
  if (!panel || !btn) return;

  btn.textContent = creativePoolSummary();
  panel.innerHTML = "";

  if (!state.kits.length) {
    panel.innerHTML = `<p class="creative-status" style="margin:8px">Add a kit first.</p>`;
    return;
  }

  state.kits.forEach((kit) => {
    const n = kitFilledCount(kit);
    const label = document.createElement("label");
    label.className =
      "creative-dd-option" + (n === 0 ? " is-disabled" : "");
    const checked = state.creativePoolKitIds.includes(kit.id);
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(kit.id)}" ${checked ? "checked" : ""} ${n === 0 ? "disabled" : ""} />
      <span>${escapeHtml(kit.name)} <span style="color:var(--ink-faint)">(${n})</span></span>`;
    const input = label.querySelector("input");
    input?.addEventListener("change", () => {
      if (n === 0) return;
      if (input.checked) {
        if (!state.creativePoolKitIds.includes(kit.id)) state.creativePoolKitIds.push(kit.id);
      } else {
        if (state.creativePoolKitIds.length <= 1) {
          input.checked = true;
          showToast("Keep at least one kit in the pool", { type: "info" });
          return;
        }
        state.creativePoolKitIds = state.creativePoolKitIds.filter((id) => id !== kit.id);
      }
      saveCreativeFunState();
      drawCreativeTrio(true);
      renderCreativeFun();
    });
    panel.appendChild(label);
  });
}

function renderCreativeFun() {
  const section = $("#creative-fun");
  if (!section) return;

  // Keep pool valid — default to active kit
  const valid = new Set(state.kits.map((k) => k.id));
  state.creativePoolKitIds = state.creativePoolKitIds.filter((id) => valid.has(id));
  if (!state.creativePoolKitIds.length && state.activeKitId && valid.has(state.activeKitId)) {
    state.creativePoolKitIds = [state.activeKitId];
  }
  if (!state.creativePoolKitIds.length && state.kits[0]) {
    state.creativePoolKitIds = [state.kits[0].id];
  }

  renderCreativeKitDropdown();

  const modeSel = $("#creative-mode-select");
  if (modeSel && modeSel.value !== state.creativeMode) {
    modeSel.value = state.creativeMode;
  }

  const pool = creativePoolColors();
  const status = $("#creative-status");
  const colors = drawCreativeTrio(false);
  const swatches = $("#creative-swatches");
  const names = $("#creative-names");
  const toMix = $("#creative-to-mix");

  if (swatches) swatches.innerHTML = "";
  if (names) names.innerHTML = "";

  if (pool.length < 3) {
    if (status) {
      status.textContent =
        pool.length === 0
          ? "Pick a kit with colors (or fill wells) — need 3+ pans in the pool."
          : `Only ${pool.length} pan${pool.length === 1 ? "" : "s"} in the pool — add more to shuffle a trio.`;
    }
    if (toMix) toMix.hidden = true;
    colors.forEach((c) => {
      if (!swatches) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "todays-swatch-btn";
      b.style.background = c.hex;
      b.title = c.name_en;
      b.innerHTML = swatchMarksHtml(c);
      b.addEventListener("click", () => openDetail(c));
      swatches.appendChild(b);
    });
    return;
  }

  if (status) status.textContent = creativeModeLabel(state.creativeMode);
  if (toMix) toMix.hidden = false;

  colors.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "todays-swatch-btn";
    b.style.background = c.hex;
    b.title = c.name_en;
    b.setAttribute("aria-label", c.name_en);
    b.innerHTML = swatchMarksHtml(c);
    b.addEventListener("click", () => openDetail(c));
    swatches?.appendChild(b);
  });
  if (names) {
    names.innerHTML = colors
      .map(
        (c) =>
          `<span class="todays-name-line">${escapeHtml(creativeColorCaption(c))}</span>`
      )
      .join("");
  }
}

function shuffleCreativeFun() {
  const pool = creativePoolColors();
  if (pool.length < 3) {
    showToast("Need 3+ pans in the pool to shuffle", { type: "info" });
    renderCreativeFun();
    return;
  }
  drawCreativeTrio(true);
  renderCreativeFun();
  showToast("New trio ready — paint what you can reach", { type: "ok", duration: 2200 });
}

function sendCreativeTrioToMixLab() {
  const colors = state.creativeDrawIds
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 3);
  if (colors.length < 2) {
    showToast("Shuffle a trio first", { type: "info" });
    return;
  }
  state.selectedMixSlots = [...colors.map((c) => c.id), null, null, null].slice(0, 3);
  switchTab("mix");
  renderMixWorkspace();
  renderMixPicker();
  showToast("Trio loaded in Mix Lab", { type: "ok" });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateFormSwatchPreview() {
  const preview = $("#f-hex-preview");
  if (!preview) return;
  const raw = ($("#f-hex")?.value || "").trim();
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    preview.style.background = hex;
  } else {
    const picker = $("#f-hex-picker")?.value;
    preview.style.background = picker || "#888888";
  }
}

function colorsByIds(ids) {
  return Mixing.sortBySpectrum(
    ids.map((id) => state.palette.colors.find((c) => c.id === id)).filter(Boolean)
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

function closeKitSwitcher() {
  const panel = $("#kit-switcher-panel");
  const btn = $("#kit-switcher-btn");
  if (panel) panel.hidden = true;
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function toggleKitSwitcher() {
  const panel = $("#kit-switcher-panel");
  const btn = $("#kit-switcher-btn");
  if (!panel || !btn) return;
  const open = panel.hidden;
  panel.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
  if (open) renderKitSwitcherPanel();
}

function selectActiveKit(kitId) {
  if (!state.kits.some((k) => k.id === kitId)) return;
  setActiveKit(kitId);
  closeKitSwitcher();
  saveKits();
  // Default Creative Fun pool follows the kit you're viewing (if only one selected)
  if (state.creativePoolKitIds.length <= 1) {
    state.creativePoolKitIds = [kitId];
    saveCreativeFunState();
  }
  renderKits();
  updateTabBadges();
  renderPalette();
}

function renderKitSwitcherPanel() {
  const panel = $("#kit-switcher-panel");
  if (!panel) return;
  panel.innerHTML = "";
  if (!state.kits.length) {
    panel.innerHTML = `<p class="empty-state" style="margin:8px;padding:4px">No kits yet.</p>`;
    return;
  }
  state.kits.forEach((kit) => {
    const n = kitFilledCount(kit);
    const active = kit.id === state.activeKitId;
    const opt = document.createElement("button");
    opt.type = "button";
    opt.setAttribute("role", "option");
    opt.setAttribute("aria-selected", String(active));
    opt.className = "kit-switcher-option" + (active ? " is-active" : "");
    opt.innerHTML = `
      <span class="kit-switcher-option-name">${escapeHtml(kit.name)}</span>
      <span class="kit-switcher-option-meta">${n} pan${n === 1 ? "" : "s"}</span>
      ${active ? `<span class="kit-switcher-check" aria-hidden="true">✓</span>` : ""}`;
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      selectActiveKit(kit.id);
    });
    panel.appendChild(opt);
  });
}

function renderKitSwitcherButton() {
  const btn = $("#kit-switcher-btn");
  if (!btn) return;
  const kit = getActiveKit();
  if (!kit) {
    btn.textContent = "Select kit";
    return;
  }
  const n = kitFilledCount(kit);
  btn.textContent = `${kit.name} · ${n} pan${n === 1 ? "" : "s"}`;
}

function renderKits() {
  const workspace = $("#kit-workspace");
  const empty = $("#kit-empty-state");
  if (!$("#kit-switcher-btn")) return;

  renderKitSwitcherButton();
  // Keep open panel contents in sync if user left it open
  if ($("#kit-switcher-panel") && !$("#kit-switcher-panel").hidden) {
    renderKitSwitcherPanel();
  }

  const kit = getActiveKit();
  if (!kit) {
    workspace.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  workspace.hidden = false;
  updateKitGuidance(kit);
  renderKitTin(kit);
  renderKitNote(kit);
  renderPaletteRead(kit);
  renderWaterLab(kit);
  // Drop wheel picks that left the kit
  const inKit = new Set(kit.slots.filter(Boolean));
  if (state.kitWheel.a && !inKit.has(state.kitWheel.a)) state.kitWheel.a = null;
  if (state.kitWheel.b && !inKit.has(state.kitWheel.b)) state.kitWheel.b = null;
  renderKitWheel();
  renderWetInWet(kit);
  renderKitCurriculum(kit);
  // Keep Creative Fun pool chips in sync with kit fills/names
  renderCreativeFun();
}

/**
 * Auto kit portrait: brands, handling character, suits, watch-outs, scorecard tags, Ace line.
 * Recomputed on every render — never overwrites kit.personalNote.
 */
function analyzeKitPortrait(kit) {
  const colors = (kit?.slots || [])
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
  const n = colors.length;

  if (!n) {
    return {
      brands: "No pans yet — add a few and I’ll gossip about the tin.",
      character: "An empty tin is full of potential (and zero drama).",
      suits: "Anything you like — start with a yellow, red/rose, and blue.",
      watchouts: "None yet. The first boss color will introduce itself.",
      ace: "Tap + under Add well. Your future limited palette is waiting.",
      tags: [],
    };
  }

  // —— Brand tally + handling bias ——
  const brandCounts = new Map();
  colors.forEach((c) => {
    const b = (c.brand || "Unknown").trim() || "Unknown";
    brandCounts.set(b, (brandCounts.get(b) || 0) + 1);
  });
  const brandRank = [...brandCounts.entries()].sort((a, b) => b[1] - a[1]);
  // Consistent format: Brand × N (show all brands, sorted by count)
  const brandsLine = brandRank.map(([name, count]) => `${name} × ${count}`).join(" · ");

  const feelOf = (brand) => {
    const b = (brand || "").toLowerCase();
    // bloom/vibrant vs control (0–2 scale)
    if (/daniel\s*smith|rosa|white\s*nights|sennelier/.test(b)) return { control: 0, bloom: 2, vibrant: 2 };
    if (/schmincke|winsor|newton|maimeri/.test(b)) return { control: 2, bloom: 0, vibrant: 0 };
    if (/graham|roman\s*szmal/.test(b)) return { control: 1, bloom: 1, vibrant: 1 };
    if (/pinax/.test(b)) return { control: 1, bloom: 1, vibrant: 1 };
    return { control: 1, bloom: 1, vibrant: 1 };
  };

  let controlScore = 0;
  let bloomScore = 0;
  let vibrantScore = 0;
  let gran = 0;
  let mixStars = 0;
  let staining = 0;
  let phthaloBoss = 0;
  colors.forEach((c) => {
    const f = feelOf(c.brand);
    controlScore += f.control;
    bloomScore += f.bloom;
    vibrantScore += f.vibrant;
    if (c.granulating) gran++;
    if (c.mix_star) mixStars++;
    if (c.staining) staining++;
    const pig = (c.pigment || "").toUpperCase();
    if (/PB15|PG7|PG36/.test(pig) || /phthalo/i.test(c.name_en || "")) phthaloBoss++;
  });

  const band = (c) => {
    try {
      const { h, s } = Mixing.hexToHsl(c.hex);
      if (s < 14) return "neutral";
      if (h < 20 || h >= 345) return "red";
      if (h < 50) return "orange";
      if (h < 75) return "yellow";
      if (h < 165) return "green";
      if (h < 255) return "blue";
      if (h < 310) return "purple";
      return "pink";
    } catch {
      return "other";
    }
  };
  const counts = {
    yellow: 0,
    orange: 0,
    red: 0,
    pink: 0,
    purple: 0,
    blue: 0,
    green: 0,
    neutral: 0,
    earth: 0,
  };
  colors.forEach((c) => {
    const fam = (c.family || "").toLowerCase();
    if (fam === "earth") counts.earth++;
    else counts[band(c)] = (counts[band(c)] || 0) + 1;
  });
  const hasYellow = counts.yellow > 0;
  const hasRed = counts.red + counts.pink > 0;
  const hasBlue = counts.blue > 0;
  const hasEarth = counts.earth > 0;
  const hasGreen = counts.green > 0;
  const warm = counts.yellow + counts.orange + counts.red + counts.pink + counts.earth;
  const cool = counts.blue + counts.green + counts.purple;

  // Character — feel only (✦ / ◈ counts live on Spectrum wells; don't repeat here)
  const characterParts = [];
  if (controlScore > bloomScore + n * 0.3) {
    characterParts.push("leans toward control — creamy lifts, polite edges, good for second washes");
  } else if (bloomScore > controlScore + n * 0.3) {
    characterParts.push("leans spreadable and lively — blooms welcome if you let them");
  } else {
    characterParts.push("mixed personality — some pans behave, some gossip on the paper");
  }
  if (vibrantScore >= n * 1.2) characterParts.push("high saturation energy");
  const character = characterParts.join("; ") + ".";

  // Suits
  const suits = [];
  if (hasEarth && hasBlue && (hasYellow || hasGreen)) suits.push("landscape-friendly");
  if (mixStars >= 3 || (hasYellow && hasRed && hasBlue && n >= 3)) suits.push("strong for mixing practice");
  if (controlScore > bloomScore && n >= 4) suits.push("detail / urban sketch control");
  if (bloomScore > controlScore && gran >= 2) suits.push("wet-in-wet and atmospheric washes");
  if (n <= 8 && hasYellow && hasRed && hasBlue) suits.push("travel primary triangle");
  if (!suits.length) suits.push("still finding its job — keep painting and the tin will confess");
  const suitsLine = suits.join(" · ");

  // Watch-outs (handling + palette gaps only — no separate Build guide)
  const watch = [];
  if (phthaloBoss >= 2) watch.push("two+ phthalo-type bosses — whisper-light when mixing");
  if (staining >= Math.max(3, Math.ceil(n * 0.4))) {
    watch.push("several staining pans — commit on purpose, lift carefully");
  }
  if (warm > 0 && cool === 0) watch.push("all warm so far — cool shadow friends missing");
  if (cool > 0 && warm === 0) watch.push("all cool so far — needs a warm glow");
  if (!hasEarth && n >= 6) watch.push("no earth yet — neutrals will work harder");
  if (!hasYellow && n >= 3) watch.push("no yellow yet — clean greens and oranges work harder");
  if (!hasRed && n >= 3) watch.push("no red/rose yet — purples and oranges lack a path");
  if (!hasBlue && n >= 3) watch.push("no blue yet — skies and cool shadows need a seat");
  const watchLine = watch.length
    ? watch.slice(0, 3).join(" · ")
    : "Nothing loud — trust the tin and paint.";

  // Scorecard chips removed — flags still feed Ace / practice card
  const tags = [];
  const isControlTin = controlScore > bloomScore + n * 0.2 && n >= 3;
  const isBloom = bloomScore > controlScore + n * 0.2 || gran >= 3;
  const isMixGym = mixStars >= 3 || (hasYellow && hasRed && hasBlue && mixStars >= 1);
  const isLand = hasEarth && hasBlue && (hasYellow || hasGreen);

  // Ace one-liner — witty always; fold build coach only when the tin still needs help
  const topBrand = brandRank[0]?.[0] || "this tin";
  let ace = "";
  if (isControlTin && /schmincke|winsor|maimeri/i.test(topBrand)) {
    ace = `${topBrand} is running a polite engineering firm in this tin — edges stay where you put them. Reward: control practice; risk: forgetting to play.`;
  } else if (isBloom) {
    ace = `This box wants water and courage. Let ${topBrand} bloom once on purpose — then decide if you’re the boss or the paint is.`;
  } else if (isMixGym) {
    ace = `A little mixing gym in a metal box. Pick three strangers from different hue families and make them negotiate.`;
  } else if (isLand) {
    ace = `Landscape bones are here: earth for dirt, blue for air, something warm for light. Now go abuse a scrap of paper.`;
  } else if (n <= 4) {
    ace = `Tiny tin energy (${n} pans). Limitation is the tutor — finish a study before you add another tube.`;
  } else {
    ace = `${n} pans, ${brandRank.length} brand${brandRank.length === 1 ? "" : "s"}. Ace’s take: paint one subject twice with only half the tin — you’ll meet your real favorites.`;
  }

  // Former Build guide: only when coach still has something useful (not a balanced tin)
  const guide = analyzeKitBuild(kit);
  if (guide.show && guide.text) {
    // Keep Ace short: one coach sentence, not the whole paragraph
    const coach = guide.text
      .replace(/^\d+\s*pans?\.\s*/i, "")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)[0];
    if (coach && coach.length > 12) {
      ace = `${ace} ${coach}`;
    }
  }

  return {
    brands: brandsLine,
    character,
    suits: suitsLine,
    watchouts: watchLine,
    ace,
    tags,
    // Internal flags for practice card (not all shown as chips)
    flags: { isControlTin, isBloom, isMixGym, isLand, hasYellow, hasRed, hasBlue, hasEarth, hasGreen },
  };
}

function renderKitNote(kit) {
  const card = $("#kit-note-card");
  if (!card || !kit) return;

  const portrait = analyzeKitPortrait(kit);
  const setText = (id, text) => {
    const el = $(id);
    if (el) el.textContent = text || "—";
  };
  setText("#kit-note-brands", portrait.brands);
  setText("#kit-note-character", portrait.character);
  setText("#kit-note-suits", portrait.suits);
  setText("#kit-note-watch", portrait.watchouts);
  setText("#kit-note-ace", portrait.ace);

  const tagsEl = $("#kit-note-tags");
  if (tagsEl) {
    // Chips retired — keep container empty/hidden
    tagsEl.innerHTML = "";
    tagsEl.hidden = true;
  }

  const ta = $("#kit-note-personal");
  if (ta) {
    // Don't clobber while the user is typing
    if (document.activeElement !== ta) {
      ta.value = kit.personalNote || kit.notes || "";
      ta.dataset.kitId = kit.id;
    } else if (ta.dataset.kitId !== kit.id) {
      ta.value = kit.personalNote || kit.notes || "";
      ta.dataset.kitId = kit.id;
    }
  }
}

function saveActiveKitPersonalNote() {
  const ta = $("#kit-note-personal");
  const kit = getActiveKit();
  if (!ta || !kit) return;
  if (ta.dataset.kitId && ta.dataset.kitId !== kit.id) return;
  const text = ta.value;
  kit.personalNote = text;
  kit.notes = text; // mirror for older sync readers
  saveKits();
  if (typeof scheduleSyncPush === "function") scheduleSyncPush();
}

/* —— Ace’s palette read (Version B coach, catalog-only suggestions) —— */

function kitColorHue(c) {
  try {
    return Mixing.hexToHsl(c.hex);
  } catch {
    return { h: 0, s: 0, l: 50 };
  }
}

function isCoolYellow(c) {
  const pig = (c.pigment || "").toUpperCase();
  const n = (c.name_en || "").toLowerCase();
  if (/PY3\b|LEMON|HANSA YELLOW LIGHT/.test(pig + n.toUpperCase())) return true;
  if ((c.family || "") !== "yellow") return false;
  const { h, s } = kitColorHue(c);
  return s >= 20 && h >= 50 && h < 75;
}

function isWarmYellow(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  if (/NAPLES|GOLD|OCHRE|SIENNA|PY150|PY216|PY40|CADMIUM YELLOW/.test(pig + " " + n.toUpperCase()))
    return true;
  if ((c.family || "") !== "yellow") return false;
  const { h, s } = kitColorHue(c);
  return s >= 15 && h >= 35 && h < 55;
}

function isCoolRose(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  const fam = (c.family || "").toLowerCase();
  if (/PV19|PR122|QUIN.*ROSE|PERMANENT ROSE|OPERA|MAGENTA|CRIMSON LAKE/.test(pig + " " + n.toUpperCase()))
    return true;
  if (fam === "pink") return true;
  if (fam === "red" || fam === "purple") {
    const { h, s } = kitColorHue(c);
    return s >= 25 && h >= 300 && h < 350;
  }
  return false;
}

function isWarmFireRed(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  if (/PYRROL|PYRROLE|SCARLET|CADMIUM RED|VERMILION|PO73|PR254|PR108|ENGLISH RED|VENETIAN/.test(
    pig + " " + n.toUpperCase()
  ))
    return true;
  if ((c.family || "") === "red" || (c.family || "") === "orange") {
    const { h, s } = kitColorHue(c);
    return s >= 30 && (h < 30 || h >= 350 || (h >= 10 && h < 45));
  }
  return false;
}

function isWarmBlue(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  if (/rose of ultramarine|ultramarine violet|ultramarine pink|ultramarine red/i.test(n))
    return false;
  if (/ultramarine|pb29/i.test(n + " " + pig)) return true;
  if (/cobalt blue/i.test(n) && !/turq/i.test(n)) return true;
  if ((c.family || "") !== "blue") return false;
  const { h, s } = kitColorHue(c);
  return s >= 15 && h >= 220 && h < 270;
}

function isCoolBlue(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  if (/PHTHALO BLUE|PB15|CERULEAN|MANGANESE|PB35|PB15:3|HELIO BLUE|WINSOR BLUE/.test(
    pig + " " + n.toUpperCase()
  ))
    return true;
  if ((c.family || "") !== "blue" && (c.family || "") !== "blue-green") return false;
  const { h, s } = kitColorHue(c);
  return s >= 15 && h >= 180 && h < 230;
}

function isPhthaloGreen(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  return /PG7|PG36|PHTHALO GREEN|VIRIDIAN|HELIO GREEN/.test(pig + " " + n.toUpperCase()) &&
    !/MAY GREEN|SAP|HOOKER/.test(n.toUpperCase());
}

function isWarmConvenienceGreen(c) {
  const n = (c.name_en || "").toLowerCase();
  return /sap green|may green|hooker|olive|shire|desert green|foliage/i.test(n);
}

function isIcyGreen(c) {
  return isPhthaloGreen(c) || /turquoise|teal|glacier|ice green|helio turquoise/i.test(c.name_en || "");
}

function isWarmEarth(c) {
  const n = (c.name_en || "").toLowerCase();
  if ((c.family || "") !== "earth" && !/sienna|umber|ochre|sepia|brown/i.test(n)) return false;
  if (/raw umber|green umber/i.test(n)) return false;
  if (/burnt sienna|burnt umber|venetian|english red|yellow ochre|raw sienna|sepia/i.test(n))
    return true;
  const { h } = kitColorHue(c);
  return h < 50 || h >= 340;
}

function isCoolEarth(c) {
  const n = (c.name_en || "").toLowerCase();
  return /raw umber|green umber|cool brown/i.test(n);
}

function isDeepDarkBlue(c) {
  const n = (c.name_en || "").toLowerCase();
  const pig = (c.pigment || "").toUpperCase();
  return /ANTHRAQUINONE|INDANTHRENE|PB60|DEEP SEA|PAYNE|INDIGO/i.test(pig + " " + n);
}

function analyzeKitRoles(colors) {
  const inKit = new Set(colors.map((c) => c.id));
  return {
    inKit,
    n: colors.length,
    coolYellow: colors.filter(isCoolYellow),
    warmYellow: colors.filter(isWarmYellow),
    coolRose: colors.filter(isCoolRose),
    warmFireRed: colors.filter(isWarmFireRed),
    warmBlue: colors.filter(isWarmBlue),
    coolBlue: colors.filter(isCoolBlue),
    deepBlue: colors.filter(isDeepDarkBlue),
    phthaloGreen: colors.filter(isPhthaloGreen),
    warmGreen: colors.filter(isWarmConvenienceGreen),
    icyGreen: colors.filter(isIcyGreen),
    warmEarth: colors.filter(isWarmEarth),
    coolEarth: colors.filter(isCoolEarth),
    anyYellow: colors.filter((c) => (c.family || "") === "yellow" || isCoolYellow(c) || isWarmYellow(c)),
    anyBlue: colors.filter((c) => /blue/i.test(c.family || "") || isWarmBlue(c) || isCoolBlue(c)),
    anyGreen: colors.filter((c) => (c.family || "") === "green" || isIcyGreen(c) || isWarmConvenienceGreen(c)),
    anyRed: colors.filter((c) => isCoolRose(c) || isWarmFireRed(c) || (c.family || "") === "red"),
  };
}

/** Prefer catalog colors not already in kit; score by role match */
function findCatalogForRole(role, inKitIds) {
  const pool = state.palette.colors.filter((c) => c && c.id && !inKitIds.has(c.id));
  const scored = [];
  pool.forEach((c) => {
    let score = 0;
    if (role === "warmFireRed" && isWarmFireRed(c)) score = 10 + (c.mix_star ? 2 : 0);
    if (role === "coolRose" && isCoolRose(c)) score = 10 + (c.mix_star ? 2 : 0);
    if (role === "coolYellow" && isCoolYellow(c)) score = 10 + (c.mix_star ? 2 : 0);
    if (role === "warmYellow" && isWarmYellow(c)) score = 8;
    if (role === "warmBlue" && isWarmBlue(c)) score = 10 + (c.granulating ? 1 : 0);
    if (role === "coolBlue" && isCoolBlue(c)) score = 9;
    if (role === "warmGreen" && isWarmConvenienceGreen(c)) score = 10;
    if (role === "warmEarth" && isWarmEarth(c)) score = 10 + (c.mix_star ? 1 : 0);
    if (role === "coolEarth" && isCoolEarth(c)) score = 10;
    if (role === "anyYellow" && ((c.family || "") === "yellow" || isCoolYellow(c))) score = 7;
    if (role === "anyBlue" && /blue/i.test(c.family || "")) score = 7;
    if (score > 0) scored.push({ c, score });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.c || null;
}

/**
 * Version B descriptive coach + dual advice + catalog suggestions.
 * needsTeaching = show open by default (hybrid).
 */
function buildAcePaletteRead(kit) {
  const colors = (kit?.slots || [])
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
  const roles = analyzeKitRoles(colors);
  const paragraphs = [];
  const suggestions = []; // { color, why }
  const gaps = []; // internal

  if (!colors.length) {
    return {
      needsTeaching: true,
      status: "Empty tin — let’s start a triangle",
      paragraphs: [
        "Your tin is a blank page. Ace’s read: start with three mixers that disagree on the wheel — a yellow, a cool rose or warm red, and a blue. That triangle already paints more than a dozen lonely convenience tubes.",
        "Dual advice: if you love mixing, skip a third green for now and force foliage from yellow + blue + a touch of earth. If you paint leaves every day and hate premixing, a warm sap-type green later is kindness, not laziness.",
      ],
      suggestions: [
        {
          color: findCatalogForRole("coolYellow", roles.inKit),
          why: "Cool/mid primary yellow — clean greens and high-key light.",
        },
        {
          color: findCatalogForRole("coolRose", roles.inKit) || findCatalogForRole("warmFireRed", roles.inKit),
          why: "A red role — cool rose for florals/glazes, or warm fire red for heat.",
        },
        {
          color: findCatalogForRole("warmBlue", roles.inKit) || findCatalogForRole("coolBlue", roles.inKit),
          why: "Blue for sky, water, and the other half of every neutral.",
        },
      ].filter((s) => s.color),
    };
  }

  // Gap detection
  if (!roles.anyYellow.length) {
    gaps.push("yellow");
    const sug = findCatalogForRole("coolYellow", roles.inKit) || findCatalogForRole("anyYellow", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "No yellow yet — without one, clean greens and oranges stay out of reach.",
      });
  }
  if (!roles.warmFireRed.length && roles.coolRose.length) {
    gaps.push("warmRed");
    const sug = findCatalogForRole("warmFireRed", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "You have cool rose energy but no fire red — sunsets and warm florals need heat, not only magenta.",
      });
  } else if (!roles.coolRose.length && roles.warmFireRed.length) {
    gaps.push("coolRose");
    const sug = findCatalogForRole("coolRose", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "Warm red is covered; a cool rose opens clean purples and floral glazes.",
      });
  } else if (!roles.anyRed.length) {
    gaps.push("anyRed");
    const sug =
      findCatalogForRole("warmFireRed", roles.inKit) || findCatalogForRole("coolRose", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "No red role at all — pick warm fire or cool rose depending on heat vs florals.",
      });
  }
  if (!roles.anyBlue.length) {
    gaps.push("blue");
    const sug = findCatalogForRole("warmBlue", roles.inKit) || findCatalogForRole("coolBlue", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "No blue — skies, water, and chromatic darks need a seat.",
      });
  }
  if (
    roles.icyGreen.length >= 2 &&
    !roles.warmGreen.length &&
    roles.anyGreen.length >= 2
  ) {
    gaps.push("warmGreen");
    const sug = findCatalogForRole("warmGreen", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "Greens are mostly icy/synthetic — a warm convenience green saves foliage time (or keep mixing from yellow + earth).",
      });
  }
  if (!roles.warmEarth.length && roles.n >= 4) {
    gaps.push("warmEarth");
    const sug = findCatalogForRole("warmEarth", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "No warm earth — Burnt Sienna-type pans unlock bark, skin warmth, and classic greys with ultramarine.",
      });
  }
  if (roles.warmEarth.length && !roles.coolEarth.length && roles.n >= 6) {
    gaps.push("coolEarth");
    const sug = findCatalogForRole("coolEarth", roles.inKit);
    if (sug)
      suggestions.push({
        color: sug,
        why: "Warm earth is here; Raw Umber-type cool earth is the teammate for slate greys and pine shadows — not a sienna swap.",
      });
  }

  // Redundant phthalo blue when deep + teal already present
  const phthaloBlueInKit = colors.filter(
    (c) =>
      isCoolBlue(c) &&
      /phthalo|pb15|helio blue|windsor blue/i.test((c.name_en || "") + (c.pigment || ""))
  );
  const hasTeal =
    colors.some((c) => /turquoise|teal|helio turquoise/i.test(c.name_en || "")) ||
    colors.some((c) => (c.family || "") === "blue-green");
  const skipPhthaloBlue =
    phthaloBlueInKit.length === 0 &&
    (roles.deepBlue.length > 0 || roles.coolBlue.length > 0) &&
    hasTeal;

  // Prose — Version B
  const nameList = (arr) => arr.slice(0, 3).map((c) => c.name_en).join(", ");

  if (gaps.includes("warmRed") && roles.coolRose.length) {
    paragraphs.push(
      `Your tin is clever but a little shy in the heat. ${nameList(roles.coolRose)} ${roles.coolRose.length === 1 ? "is" : "are"} beautiful cool rose energy — florals, glazes, polite pinks — yet ${roles.coolRose.length === 1 ? "it" : "they"} will never give you a sunset that bites. That’s a role hole, not a “not enough reds” hole.`
    );
    if (suggestions[0]?.color && isWarmFireRed(suggestions[0].color)) {
      paragraphs.push(
        `${suggestions[0].color.name_en} (${suggestions[0].color.brand}) is the furnace missing from the row: warm, clean with yellow into orange that doesn’t go brick. Put a fire red next to a cool green and you can knead darks that still feel alive.`
      );
    }
  }

  if (gaps.includes("warmGreen")) {
    paragraphs.push(
      `Your greens lean refrigerator-light${roles.icyGreen.length ? ` (${nameList(roles.icyGreen)})` : ""} — excellent for glass water and electric leaves, then they make you earn every olive. A warm sap-type green is laziness in the best sense; if you’d rather learn, force yellow + earth + a whisper of blue and treat convenience green as optional.`
    );
  }

  if (gaps.includes("yellow")) {
    paragraphs.push(
      "No yellow means your blues and reds have no bridge into clean greens or pure oranges. One primary yellow does more work than three near-identical convenience neutrals."
    );
  }

  if (gaps.includes("blue")) {
    paragraphs.push(
      "Without a blue, the tin can’t build sky, water, or honest chromatic darks. Warm ultramarine and cool phthalo are different jobs — start with one, learn its manners, then add the other if you need both weather and ice."
    );
  }

  if (gaps.includes("warmEarth") || gaps.includes("coolEarth")) {
    paragraphs.push(
      "Earths are temperature tools, not “brown.” Burnt Sienna-type pans are roasted warm red-brown; Raw Umber-type pans are cool espresso with a greenish undertone. They team with blues into different greys — keep both roles when the tin has room."
    );
  }

  if (skipPhthaloBlue || (roles.deepBlue.length && hasTeal && roles.coolBlue.length >= 1)) {
    paragraphs.push(
      "Dual advice on blue shopping: if you already own a deep dark blue and a turquoise/teal, pure Phthalo Blue often stacks the same cool personality twice. Spend the slot on a missing temperature role (warm red, warm green, earth) instead."
    );
  }

  // Always dual advice closer when teaching
  if (gaps.length) {
    paragraphs.push(
      "Dual advice overall: buy for roles you can’t mix cleanly, mix for roles you’re willing to practice. A small tin with a full temperature story beats a fat tin of cousins."
    );
  }

  // Balanced tin — short review prose
  const needsTeaching = gaps.length > 0 || colors.length < 3;
  if (!needsTeaching) {
    paragraphs.push(
      `This tin already has a working temperature story — yellows, reds/roses, blues, and enough earth or green to paint real light. Ace’s review: keep painting before you shop; limitation is still the better tutor.`
    );
    if (roles.warmEarth.length && roles.coolEarth.length) {
      paragraphs.push(
        `Your warm earth (${nameList(roles.warmEarth)}) and cool earth (${nameList(roles.coolEarth)}) are teammates, not twins — use them on purpose for heat vs slate.`
      );
    }
    if (roles.coolRose.length && roles.warmFireRed.length) {
      paragraphs.push(
        `Cool rose + warm fire red both present — you can choose heat or glaze without fighting the wrong primary.`
      );
    }
    paragraphs.push(
      "Dual advice: if something still feels missing, it’s probably a convenience color for a subject you paint weekly — not another near-duplicate primary."
    );
  }

  // Opening line when we have colors but only generic gaps
  if (needsTeaching && !paragraphs.length) {
    paragraphs.push(
      `Ace’s read of this tin (${colors.length} pans): a few mixing roles still need a seat. Open the suggestions below — each is already in your studio catalog.`
    );
  }

  // Dedupe suggestions by color id, max 3
  const seen = new Set();
  const uniqSug = [];
  suggestions.forEach((s) => {
    if (!s.color || seen.has(s.color.id)) return;
    seen.add(s.color.id);
    uniqSug.push(s);
  });

  return {
    needsTeaching,
    status: needsTeaching
      ? gaps.length
        ? `${gaps.length} role gap${gaps.length === 1 ? "" : "s"} · building mode`
        : "Still building"
      : "Looks solid · review anytime",
    paragraphs,
    suggestions: uniqSug.slice(0, 3),
  };
}

function renderPaletteRead(kit) {
  const section = $("#palette-read");
  if (!section || !kit) return;

  if (state.paletteReadKitId !== kit.id) {
    state.paletteReadKitId = kit.id;
    state.paletteReadOpenOverride = null;
  }

  const read = buildAcePaletteRead(kit);
  section.hidden = false;
  section.classList.toggle("is-teaching", read.needsTeaching);

  const statusEl = $("#palette-read-status");
  if (statusEl) statusEl.textContent = read.status;

  const prose = $("#palette-read-prose");
  if (prose) {
    prose.innerHTML = (read.paragraphs || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }

  const sugWrap = $("#palette-read-suggestions");
  if (sugWrap) {
    if (read.suggestions?.length) {
      sugWrap.hidden = false;
      sugWrap.innerHTML = read.suggestions
        .map((s) => {
          const c = s.color;
          return `<button type="button" class="palette-read-suggest" data-color-id="${escapeHtml(c.id)}">
            <span class="palette-read-suggest-swatch" style="background:${escapeHtml(c.hex)}" aria-hidden="true"></span>
            <span class="palette-read-suggest-text">
              <span class="palette-read-suggest-name">${escapeHtml(c.name_en)}</span>
              <span class="palette-read-suggest-meta">${escapeHtml(c.brand)}${c.temp_role ? " · " + escapeHtml(c.temp_role.split(" · ").slice(0, 2).join(" · ")) : ""}</span>
              <span class="palette-read-suggest-why">${escapeHtml(s.why)}</span>
            </span>
          </button>`;
        })
        .join("");
      sugWrap.querySelectorAll(".palette-read-suggest").forEach((btn) => {
        btn.addEventListener("click", () => {
          const col = state.palette.colors.find((x) => x.id === btn.dataset.colorId);
          if (col && typeof openDetail === "function") openDetail(col);
        });
      });
    } else {
      sugWrap.hidden = true;
      sugWrap.innerHTML = "";
    }
  }

  // Hybrid open state
  const defaultOpen = read.needsTeaching;
  const open =
    state.paletteReadOpenOverride === null ? defaultOpen : state.paletteReadOpenOverride;
  const body = $("#palette-read-body");
  const toggle = $("#palette-read-toggle");
  if (body) body.hidden = !open;
  if (toggle) toggle.setAttribute("aria-expanded", String(open));
}

function togglePaletteRead() {
  const body = $("#palette-read-body");
  if (!body) return;
  const next = body.hidden;
  state.paletteReadOpenOverride = next;
  body.hidden = !next;
  $("#palette-read-toggle")?.setAttribute("aria-expanded", String(next));
}

/** Classic water-control ladder — same hue, more pigment each step */
const WATER_LADDER = [
  {
    id: "tea",
    label: "Tea",
    opacity: 0.18,
    recipe: "Mostly water, a breath of pigment. Should look like tinted water, not “light paint.”",
  },
  {
    id: "milk",
    label: "Milk",
    opacity: 0.38,
    recipe: "Still transparent — paper glow shows through. Good for first washes and sky bases.",
  },
  {
    id: "cream",
    label: "Cream",
    opacity: 0.62,
    recipe: "Paint and water share the brush. Mid-values, soft shape, still movable for a moment.",
  },
  {
    id: "butter",
    label: "Butter",
    opacity: 0.9,
    recipe: "Pigment-rich, little free water. For darks and accents — easy to overdo if the paper is still shiny.",
  },
];

function hexToRgba(hex, alpha) {
  const h = String(hex || "#888888").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return `rgba(120,100,80,${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function waterLabTipForColor(color) {
  if (!color) return "";
  const bits = [];
  if (color.granulating) {
    bits.push("✦ Granulating — tea and milk show texture best; don’t scrub butter into mud.");
  }
  if (color.staining) {
    bits.push("Staining — tea is your friend for first layers; butter won’t lift clean later.");
  }
  if (color.mix_star) {
    bits.push("◈ Good mixer — try the ladder, then mix a neighbor at milk strength only.");
  }
  if (!bits.length) {
    bits.push(
      "Watch the sheen: shiny = still wet enough to bloom; matte = safer for the next darker step."
    );
  } else {
    bits.push("Climb only when the previous step loses its shine — patience is a water skill.");
  }
  return bits.join(" ");
}

/**
 * Water lab — ladder practice for the active kit.
 * Pick one pan; four target washes (Tea → Butter). No scoring, just targets + tips.
 */
function renderWaterLab(kit) {
  const section = $("#water-lab");
  if (!section || !kit) return;

  const colors = (kit.slots || [])
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);

  const emptyEl = $("#water-lab-empty");
  const bodyEl = $("#water-lab-body");
  const select = $("#water-lab-color");
  const swatchRow = $("#water-lab-swatch-row");
  const stepsEl = $("#water-lab-steps");
  const tipEl = $("#water-lab-tip");

  if (!colors.length) {
    if (emptyEl) emptyEl.hidden = false;
    if (bodyEl) bodyEl.hidden = true;
    state.waterLabColorId = null;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;
  if (bodyEl) bodyEl.hidden = false;

  // Keep selection inside this kit; default first pan
  if (!state.waterLabColorId || !colors.some((c) => c.id === state.waterLabColorId)) {
    state.waterLabColorId = colors[0].id;
  }
  const active = colors.find((c) => c.id === state.waterLabColorId) || colors[0];

  if (select) {
    const prevFocus = document.activeElement === select;
    select.innerHTML = "";
    colors.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.name_en}${c.brand ? ` · ${c.brand}` : ""}`;
      if (c.id === active.id) opt.selected = true;
      select.appendChild(opt);
    });
    if (prevFocus) select.focus();
  }

  if (swatchRow) {
    swatchRow.innerHTML = "";
    WATER_LADDER.forEach((step) => {
      const cell = document.createElement("div");
      cell.className = "water-lab-swatch";
      cell.setAttribute("role", "listitem");
      cell.title = `${step.label}: target wash strength`;
      cell.innerHTML = `
        <span class="water-lab-swatch-fill" style="background:${hexToRgba(active.hex, step.opacity)}"></span>
        <span class="water-lab-swatch-label">${escapeHtml(step.label)}</span>`;
      swatchRow.appendChild(cell);
    });
  }

  if (stepsEl) {
    stepsEl.innerHTML = WATER_LADDER.map(
      (step) =>
        `<li><strong>${escapeHtml(step.label)}</strong> — ${escapeHtml(step.recipe)}</li>`
    ).join("");
  }

  if (tipEl) {
    tipEl.textContent = waterLabTipForColor(active);
  }
}

function wetLabPairChipHtml(tag, color) {
  if (!color) {
    return `<span class="wet-lab-chip wet-lab-chip--empty"><span class="wet-lab-chip-tag">${escapeHtml(tag)}</span><span class="wet-lab-chip-name">—</span></span>`;
  }
  return `<span class="wet-lab-chip">
    <span class="wet-lab-chip-swatch" style="background:${escapeHtml(color.hex)}"></span>
    <span class="wet-lab-chip-tag">${escapeHtml(tag)}</span>
    <span class="wet-lab-chip-name">${escapeHtml(color.name_en)}</span>
  </span>`;
}

function wetInWetTip(a, b) {
  const bits = [];
  if (a.granulating || b.granulating) {
    bits.push("At least one ✦ granulator — soft edge will show texture; don’t stir hard edge into soup.");
  }
  if (a.staining && b.staining) {
    bits.push("Both stain — soft blooms stay; hard edges are permanent. Commit lightly.");
  }
  if (a.mix_star && b.mix_star) {
    bits.push("Two ◈ mixers — also try a third strip: milk-strength premix of A+B down the middle.");
  }
  if (!bits.length) {
    bits.push("Rule of thumb: soft = second color while the first still shines; hard = wait until matte, then paint beside (not into) the first.");
  }
  return bits.join(" ");
}

/**
 * Wet-in-wet drills from Mix wheel A/B — soft edge vs hard edge.
 */
function renderWetInWet(kit) {
  const section = $("#wet-lab");
  if (!section) return;

  const a = state.kitWheel.a ? state.palette.colors.find((c) => c.id === state.kitWheel.a) : null;
  const b = state.kitWheel.b ? state.palette.colors.find((c) => c.id === state.kitWheel.b) : null;
  // Must both be in this kit (wheel can lag one frame)
  const inKit = new Set((kit?.slots || []).filter(Boolean));
  const aOk = a && inKit.has(a.id);
  const bOk = b && inKit.has(b.id);

  const emptyEl = $("#wet-lab-empty");
  const bodyEl = $("#wet-lab-body");

  if (!aOk || !bOk) {
    if (emptyEl) emptyEl.hidden = false;
    if (bodyEl) bodyEl.hidden = true;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;
  if (bodyEl) bodyEl.hidden = false;

  const pair = $("#wet-lab-pair");
  if (pair) {
    pair.innerHTML =
      wetLabPairChipHtml("A", a) +
      `<span class="wet-lab-pair-plus" aria-hidden="true">+</span>` +
      wetLabPairChipHtml("B", b);
  }

  const soft = $("#wet-lab-demo-soft");
  const hard = $("#wet-lab-demo-hard");
  if (soft) {
    soft.style.background = `linear-gradient(90deg, ${a.hex} 0%, ${a.hex} 28%, ${hexToRgba(b.hex, 0.85)} 52%, ${b.hex} 100%)`;
  }
  if (hard) {
    hard.style.background = `linear-gradient(90deg, ${a.hex} 0%, ${a.hex} 48%, ${b.hex} 52%, ${b.hex} 100%)`;
  }

  const drills = $("#wet-lab-drills");
  if (drills) {
    drills.innerHTML = `
      <li><strong>Soft edge (wet-in-wet)</strong> — Wet a strip of paper (clean water sheen). Drop <em>${escapeHtml(a.name_en)}</em> at milk–cream strength. While it still shines, touch <em>${escapeHtml(b.name_en)}</em> into the wet edge and let them meet. Don’t scrub.</li>
      <li><strong>Hard edge (wet-on-dry)</strong> — Same two colors. Paint a shape with A; wait until the sheen dies (matte). Paint B right against the edge — clean meeting line, no second color into the first.</li>
      <li><strong>Compare</strong> — Same pair, two strips. Soft should feel atmospheric; hard should read as cut paper shapes. Name which mood you wanted.</li>`;
  }

  const tip = $("#wet-lab-tip");
  if (tip) tip.textContent = wetInWetTip(a, b);
}

/** Stable daily seed so practice card doesn’t flicker every re-render; shuffle nonce refreshes picks */
function practiceSeed(kitId) {
  const day = new Date().toDateString();
  const s = `${kitId || "kit"}|${day}|${APP_VERSION}|${state.practiceShuffleNonce}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shufflePracticeCard() {
  state.practiceShuffleNonce += 1;
  const kit = getActiveKit();
  if (kit) renderKitCurriculum(kit);
  showToast("Fresh practice picks", { type: "ok", duration: 1600 });
}

function seededPick(arr, seed, n = 1) {
  if (!arr.length) return [];
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

/** All mix_tips whose partners are also in this kit */
function collectKitMixRecipes(colors) {
  const idSet = new Set(colors.map((c) => c.id));
  const byId = new Map(colors.map((c) => [c.id, c]));
  const recipes = [];
  const seen = new Set();

  colors.forEach((host) => {
    (host.mix_tips || []).forEach((tip) => {
      const partners = tip.with || [];
      if (!partners.length) return;
      if (!partners.every((id) => idSet.has(id))) return;
      const partnerColors = partners.map((id) => byId.get(id)).filter(Boolean);
      if (partnerColors.length !== partners.length) return;
      const recipeIds = [host.id, ...partners].sort();
      const key = recipeIds.join("|") + "|" + (tip.result || "");
      if (seen.has(key)) return;
      seen.add(key);
      recipes.push({
        colors: [host, ...partnerColors],
        result: (tip.result || "").trim(),
        verified: !!tip.verified,
      });
    });
  });

  recipes.sort((a, b) => Number(b.verified) - Number(a.verified));
  return recipes;
}

function studySubjectForHue(hueName, mixHex) {
  const h = (hueName || "").toLowerCase();
  let hue = 90;
  try {
    hue = Mixing.hexToHsl(mixHex || "#888").h;
  } catch {
    /* ignore */
  }
  if (/green|sage|olive|teal/.test(h) || (hue >= 75 && hue < 165)) {
    return {
      scene: "a small grassland strip",
      wash: "a first wash for distant grass and sunlit bank",
      wet: "cooler darker green clumps into the wet wash",
      hard: "a warm path or fence post when matte",
    };
  }
  if (/blue|cyan|indigo/.test(h) || (hue >= 185 && hue < 255)) {
    return {
      scene: "a sky-and-water scrap",
      wash: "a soft sky or distant water band",
      wet: "a slightly greener or greyer note into the wet edge for weather",
      hard: "a hard horizon or rooftop when dry",
    };
  }
  if (/purple|violet|lilac|magenta/.test(h) || (hue >= 255 && hue < 320)) {
    return {
      scene: "evening shadows on a wall",
      wash: "a milk–cream shadow shape",
      wet: "a warmer note into the wet shadow for reflected light",
      hard: "a hard window edge when matte",
    };
  }
  if (/orange|coral|peach/.test(h) || (hue >= 15 && hue < 45)) {
    return {
      scene: "warm rooftops or late light on stone",
      wash: "a light warm plane",
      wet: "a cooler violet-grey into the shade side while shiny",
      hard: "a hard eave line when matte",
    };
  }
  if (/yellow|gold/.test(h) || (hue >= 45 && hue < 75)) {
    return {
      scene: "sunlit field or stucco wall",
      wash: "a pale tea–milk light plane",
      wet: "a soft earth or green into the wet edge for mid-ground",
      hard: "a dark accent (tree trunk / window) when matte",
    };
  }
  if (/brown|earth|neutral|gray|grey/.test(h) || hue < 15 || hue >= 345) {
    return {
      scene: "a muddy path or tree trunk study",
      wash: "a mid earth wash for ground or bark",
      wet: "a cooler blue-grey into the wet shadow",
      hard: "a hard root or curb when matte",
    };
  }
  return {
    scene: "a 10-minute mini landscape scrap",
    wash: "a first atmospheric wash",
    wet: "a second tin color into the wet edge for depth",
    hard: "one hard accent when matte",
  };
}

function formatStudyExercise(recipe, colors, seed, index) {
  const pair = recipe.colors.slice(0, 2);
  const a = pair[0];
  const b = pair[1] || pair[0];
  const rest = colors.filter((c) => c.id !== a.id && c.id !== b.id);
  const accent = seededPick(rest, seed + 17 + index * 31, 1)[0] || null;

  let resultText = recipe.result;
  let mark = recipe.verified ? "Verified recipe" : "Ace’s try — experiment";
  let mixHex = a.hex;

  if (!resultText) {
    try {
      const mix = Mixing.mixColors([a, b], state.palette);
      resultText = mix.hueName
        ? `a ${mix.hueName} (screen guess ≈ ${mix.hex.toUpperCase()})`
        : `a mixed hue (screen guess ≈ ${mix.hex.toUpperCase()})`;
      mixHex = mix.hex;
      mark = "Ace’s try — experiment";
    } catch {
      resultText = "an interesting middle hue";
      mark = "Ace’s try — experiment";
    }
  } else if (!recipe.verified) {
    mark = "Ace’s try — experiment";
  }

  // Hue for subject: parse from mix when we have hex
  let hueName = resultText;
  try {
    const mix = Mixing.mixColors([a, b], state.palette);
    hueName = mix.hueName || resultText;
    mixHex = mix.hex || mixHex;
  } catch {
    /* keep */
  }
  const subject = studySubjectForHue(hueName, mixHex);
  const wetFriend = accent ? accent.name_en : b.name_en;

  const title = `${a.name_en} + ${b.name_en}`;
  const body = `Mix ${a.name_en} with ${b.name_en} → ${resultText}. [${mark}] Study: paint ${subject.scene}. Use that mix for ${subject.wash}; while it still shines, wet-in-wet with ${wetFriend} for ${subject.wet}; then ${subject.hard}.`;

  return {
    id: `study-${a.id}-${b.id}-${index}`,
    kicker: recipe.verified ? "Study · verified" : "Study · Ace’s try",
    title,
    body,
  };
}

/**
 * Practice card: 1 skill drill + 2 mini studies.
 * Studies auto-pick pairs (not Mix wheel). Prefer verified kit recipes; else Ace’s try.
 */
function buildCurriculumExercises(kit) {
  const colors = (kit?.slots || [])
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
  if (!colors.length) return [];

  const seed = practiceSeed(kit.id);
  const portrait = analyzeKitPortrait(kit);
  const flags = portrait.flags || {};
  const pick = (pred) => colors.find(pred) || null;
  const gran = pick((c) => c.granulating);
  const mixer = pick((c) => c.mix_star);
  const controlBrand = pick((c) =>
    /schmincke|winsor|newton|maimeri/i.test(c.brand || "")
  );

  // —— 1 skill (ladder / edges / lift / bloom), auto-picked ——
  const skillPool = [];
  const ladderColor = mixer || gran || seededPick(colors, seed + 3, 1)[0];
  skillPool.push({
    id: "skill-ladder",
    kicker: "Skill · water",
    title: `Ladder with ${ladderColor.name_en}`,
    body: `In Water lab, climb Tea → Milk → Cream → Butter with only this pan. Wait for the sheen to die between steps. Goal: four distinct values — not four similar puddles.`,
  });

  if (colors.length >= 2) {
    const pair = seededPick(colors, seed + 11, 2);
    const wa = pair[0];
    const wb = pair[1] || colors.find((c) => c.id !== wa.id);
    if (wa && wb) {
      skillPool.push({
        id: "skill-wet",
        kicker: "Skill · edges",
        title: `Soft vs hard: ${wa.name_en} + ${wb.name_en}`,
        body: `Set these two on the Mix wheel if you like, then run both Wet-in-wet drills: soft bloom while shiny, hard edge when matte. One sentence after: which edge matched the mood you wanted?`,
      });
    }
  }

  if (controlBrand || flags.isControlTin) {
    const c = controlBrand || ladderColor;
    skillPool.push({
      id: "skill-lift",
      kicker: "Skill · control",
      title: `Lift test: ${c.name_en}`,
      body: `Paint a cream rectangle. When damp (sheen almost gone), lift a soft highlight with a clean damp brush or tissue. Note how far it lifts — forgiving pans teach; staining pans don’t.`,
    });
  }

  if (gran || flags.isBloom) {
    const g = gran || ladderColor;
    skillPool.push({
      id: "skill-bloom",
      kicker: "Skill · bloom",
      title: `Invite a bloom with ${g.name_en}`,
      body: `Milk wash, still shiny: drop a clean water bead at the edge and watch. Second strip: same wash, wait for matte, drop water — compare. Texture is a teacher, not a mistake.`,
    });
  }

  const skill = seededPick(skillPool, seed + 5, 1)[0];

  // —— 2 studies from verified recipes first, then Ace pairs ——
  const recipes = collectKitMixRecipes(colors);
  const verified = recipes.filter((r) => r.verified && r.colors.length >= 2);
  const unverifiedTips = recipes.filter((r) => !r.verified && r.colors.length >= 2);

  const studies = [];
  const usedPairKeys = new Set();
  const pairKey = (cols) =>
    cols
      .slice(0, 2)
      .map((c) => c.id)
      .sort()
      .join("|");

  const pushStudy = (recipe, idx) => {
    if (!recipe?.colors || recipe.colors.length < 2) return;
    const key = pairKey(recipe.colors);
    if (usedPairKeys.has(key)) return;
    usedPairKeys.add(key);
    studies.push(formatStudyExercise(recipe, colors, seed, idx));
  };

  seededPick(verified, seed + 19, 4).forEach((r, i) => {
    if (studies.length >= 2) return;
    pushStudy(r, i);
  });

  // Ace-suggested pairs: prefer different families / mix stars, not Mix wheel
  if (studies.length < 2 && colors.length >= 2) {
    const candidates = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const ca = colors[i];
        const cb = colors[j];
        const key = pairKey([ca, cb]);
        if (usedPairKeys.has(key)) continue;
        let score = 0;
        if (ca.mix_star) score += 2;
        if (cb.mix_star) score += 2;
        if ((ca.family || "") !== (cb.family || "")) score += 2;
        try {
          const ha = Mixing.hexToHsl(ca.hex).h;
          const hb = Mixing.hexToHsl(cb.hex).h;
          const dh = Math.min(Math.abs(ha - hb), 360 - Math.abs(ha - hb));
          if (dh > 40) score += 2;
          if (dh > 80) score += 1;
        } catch {
          /* ignore */
        }
        candidates.push({ colors: [ca, cb], result: "", verified: false, score });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    const top = candidates.slice(0, Math.min(8, candidates.length));
    seededPick(top, seed + 29, 4).forEach((r, i) => {
      if (studies.length >= 2) return;
      pushStudy(r, 10 + i);
    });
  }

  // Fill with unverified stored tips if still short
  if (studies.length < 2) {
    seededPick(unverifiedTips, seed + 41, 4).forEach((r, i) => {
      if (studies.length >= 2) return;
      pushStudy({ ...r, verified: false }, 20 + i);
    });
  }

  const out = [];
  if (skill) out.push(skill);
  out.push(...studies.slice(0, 2));
  return out;
}

function renderKitCurriculum(kit) {
  const list = $("#kit-curriculum-list");
  const empty = $("#kit-curriculum-empty");
  const shuffleBtn = $("#kit-practice-shuffle");
  if (!list) return;

  const exercises = buildCurriculumExercises(kit);
  if (shuffleBtn) shuffleBtn.disabled = !exercises.length;
  if (!exercises.length) {
    list.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  list.innerHTML = exercises
    .map(
      (ex) => `<li class="kit-curriculum-item">
      <span class="kit-curriculum-item-kicker">${escapeHtml(ex.kicker)}</span>
      <p class="kit-curriculum-item-title">${escapeHtml(ex.title)}</p>
      <p class="kit-curriculum-item-body">${escapeHtml(ex.body)}</p>
    </li>`
    )
    .join("");
}

/**
 * Build guide UI retired — coach text now folds into Kit note Ace line when needed.
 */
function updateKitGuidance(_kit) {
  const el = $("#kit-guidance");
  const textEl = $("#kit-guidance-text");
  if (el) el.hidden = true;
  if (textEl) textEl.textContent = "";
}

function analyzeKitBuild(kit) {
  const colors = kit.slots
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
  const n = colors.length;
  // Wells grow on demand — coach by palette balance, not a fixed tin size

  const band = (c) => {
    try {
      const { h, s } = Mixing.hexToHsl(c.hex);
      if (s < 14) return "neutral";
      if (h < 20 || h >= 345) return "red";
      if (h < 50) return "orange";
      if (h < 75) return "yellow";
      if (h < 165) return "green";
      if (h < 255) return "blue";
      if (h < 310) return "purple";
      return "pink";
    } catch {
      return "other";
    }
  };

  const counts = {
    yellow: 0,
    orange: 0,
    red: 0,
    pink: 0,
    purple: 0,
    blue: 0,
    green: 0,
    neutral: 0,
    earth: 0,
    other: 0,
  };
  let gran = 0;
  let mixStars = 0;
  let phthaloBoss = 0;
  colors.forEach((c) => {
    const fam = (c.family || "").toLowerCase();
    if (fam === "earth") counts.earth++;
    else counts[band(c)] = (counts[band(c)] || 0) + 1;
    if (c.granulating) gran++;
    if (c.mix_star) mixStars++;
    const pig = (c.pigment || "").toUpperCase();
    if (/PB15|PG7|PG36/.test(pig) || /phthalo/i.test(c.name_en || "")) phthaloBoss++;
  });

  const warm = counts.yellow + counts.orange + counts.red + counts.pink + counts.earth;
  const cool = counts.blue + counts.green + counts.purple;
  const hasYellow = counts.yellow > 0;
  const hasRed = counts.red + counts.pink > 0;
  const hasBlue = counts.blue > 0;
  const hasEarth = counts.earth > 0;
  const hasGreen = counts.green > 0;
  const bands = ["yellow", "red", "blue", "green", "purple", "earth", "neutral"].filter(
    (k) => (k === "red" ? counts.red + counts.pink > 0 : counts[k] > 0)
  ).length;

  // Looks good → hide guide (balanced kit; size is flexible)
  const looksComplete =
    n >= 6 &&
    hasYellow &&
    hasRed &&
    hasBlue &&
    (hasEarth || counts.neutral > 0 || hasGreen) &&
    bands >= 4;

  if (looksComplete) {
    return { show: false, text: "" };
  }

  // Empty / just started
  if (n === 0) {
    return {
      show: true,
      text:
        "Tap + to add wells as you go. Start with three mixers: a yellow, a red or rose, and a blue — then earth and one dark if you need them.",
    };
  }
  if (n === 1) {
    return {
      show: true,
      text: `Nice start with ${colors[0].name_en}. Next: pick a different hue family so you can mix — not a second cousin of the same color.`,
    };
  }
  if (n === 2) {
    return {
      show: true,
      text: "Two tubes in. Add a third far away on the wheel so you have a real mixing triangle (yellow + red/rose + blue is classic).",
    };
  }

  const tips = [];

  if (!hasYellow) {
    tips.push("Add a yellow (cool Hansa or warm earth-yellow) — without it, clean greens and oranges are hard.");
  } else if (counts.yellow === 1 && n <= 12) {
    tips.push("One yellow is a start; a second (cooler or warmer) gives cleaner mixes if the kit is small.");
  }

  if (!hasRed) {
    tips.push("Add a red or rose (warm scarlet or cool quin rose) so purples and oranges have a path.");
  }

  if (!hasBlue) {
    tips.push("Add a blue (ultramarine for granulating skies, or a phthalo for staining punch).");
  } else if (counts.blue === 1 && n >= 4 && n < 16) {
    tips.push("Only one blue so far — a second blue (warmer ultra vs cooler phthalo) usually earns its slot.");
  }

  if (hasYellow && hasBlue && !hasGreen && n >= 4 && n < 14) {
    tips.push("You can mix greens from yellow+blue — or add one convenience green if you paint foliage a lot.");
  }

  if (!hasEarth && n >= 5 && n < 20) {
    tips.push("Consider an earth (burnt sienna, raw umber) — the fast road to neutrals with ultramarine.");
  }

  if (warm > 0 && cool === 0) {
    tips.push("All warm so far — add something cool (blue/green/violet) so shadows don’t turn muddy brown.");
  }
  if (cool > 0 && warm === 0) {
    tips.push("All cool so far — add a warm yellow or earth so the kit can glow, not only chill.");
  }

  if (phthaloBoss >= 2 && n <= 12) {
    tips.push("Two+ phthalo-type bosses in a small kit — go whisper-light when mixing, or swap one for a gentler neighbor.");
  }

  if (gran === 0 && n >= 6 && n < 20) {
    tips.push("No granulating color yet — one mineral blue or earth teaches texture (✦) without cluttering the tin.");
  }

  if (mixStars === 0 && n >= 3) {
    tips.push("None marked ◈ good-for-mix yet — a few clean mixers make a tiny kit work harder.");
  }

  if (counts.neutral === 0 && n >= 8 && n < 20) {
    tips.push("Optional: a grey or Payne’s for quick values without mixing every shadow from scratch.");
  }

  if (!tips.length) {
    if (n < 12) {
      return {
        show: true,
        text: `Solid spread so far (${n} pans). Add more when a gap shows up in painting — or stop; small kits teach discipline.`,
      };
    }
    return { show: false, text: "" };
  }

  const head = `${n} pan${n === 1 ? "" : "s"}. `;
  const body = tips.slice(0, 2).join(" ");
  return { show: true, text: head + body };
}

function updateKitTinHint() {
  const hint = $("#kit-tin-hint");
  const done = $("#kit-edit-done");
  if (done) done.hidden = !state.kitWellEditMode;
  if (!hint) return;
  hint.textContent = state.kitWellEditMode
    ? "Jiggle mode · tap − to remove a well · Done when finished"
    : "Spectrum · 6 / row · tap = A/B · hold = edit · + = add well";
}

function setKitWellEditMode(on) {
  state.kitWellEditMode = !!on;
  const kit = getActiveKit();
  if (kit) renderKitTin(kit);
  else updateKitTinHint();
  if (state.kitWellEditMode) {
    showToast("Tap − to remove pans · Done when finished", {
      type: "info",
      duration: 2400,
    });
  }
}

function removeColorFromKitSlot(kit, index, colorId) {
  if (!kit || index < 0 || index >= kit.slots.length) return;
  // Drop the well entirely (not leave a null hole) — size follows the painting kit
  kit.slots.splice(index, 1);
  kit.orderMode = "manual";
  if (colorId && state.kitWheel.a === colorId) state.kitWheel.a = null;
  if (colorId && state.kitWheel.b === colorId) state.kitWheel.b = null;
  saveKits();
  renderKits();
  updateTabBadges();
  renderPalette();
  refreshDetailActions();
}

function canAddKitWell(kit) {
  return !!kit && kit.slots.length < KIT_SLOT_MAX;
}

function makeAddKitWellButton(kit) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "kit-well kit-well--empty kit-well--add";
  btn.title = canAddKitWell(kit)
    ? "Add a well — pick a color"
    : `Max ${KIT_SLOT_MAX} wells`;
  btn.setAttribute("aria-label", "Add a well");
  btn.innerHTML = `<span class="kit-well-plus">+</span>`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddKitWell(kit)) {
      showToast(`Max ${KIT_SLOT_MAX} wells in a kit.`, { type: "info" });
      return;
    }
    // Append mode: picker will push a new well when a color is chosen
    openKitPicker(-1);
  });
  return btn;
}

function renderKitTin(kit) {
  const tin = $("#kit-tin");
  if (!tin) return;
  tin.className =
    "kit-tin kit-tin--spectrum" + (state.kitWellEditMode ? " is-editing" : "");
  tin.innerHTML = "";
  updateKitTinHint();

  const filled = [];
  const emptyIdx = [];
  kit.slots.forEach((id, index) => {
    if (!id) {
      emptyIdx.push(index);
      return;
    }
    const color = state.palette.colors.find((c) => c.id === id);
    if (color) filled.push({ index, color });
    else emptyIdx.push(index);
  });

  // Always display filled pans in rainbow spectrum order (learning layout)
  const sortedColors = Mixing.sortBySpectrum(filled.map((f) => f.color));
  const byId = new Map(filled.map((f) => [f.color.id, f]));
  const items = sortedColors.map((c) => byId.get(c.id)).filter(Boolean);

  if (items.length) {
    const section = document.createElement("section");
    section.className = "kit-hue-group";
    section.innerHTML = `<h4 class="kit-hue-label">Spectrum · ${items.length}</h4>`;
    const row = document.createElement("div");
    row.className = "kit-hue-row";
    items.forEach((item) => row.appendChild(makeKitWell(kit, item.index, item.color)));
    section.appendChild(row);
    tin.appendChild(section);
  } else if (!emptyIdx.length) {
    const intro = document.createElement("p");
    intro.className = "empty-state";
    intro.textContent = "No wells yet — tap + to add your first color.";
    tin.appendChild(intro);
  }

  // Legacy empty slots (from older fixed-size kits) stay fillable until removed
  if (emptyIdx.length) {
    const section = document.createElement("section");
    section.className = "kit-hue-group kit-hue-group--empty";
    section.innerHTML = `<h4 class="kit-hue-label">Empty wells · ${emptyIdx.length}</h4>`;
    const row = document.createElement("div");
    row.className = "kit-hue-row";
    emptyIdx.forEach((index) => row.appendChild(makeKitWell(kit, index, null)));
    section.appendChild(row);
    tin.appendChild(section);
  }

  // Always offer grow-on-demand (unless at soft max)
  if (canAddKitWell(kit)) {
    const section = document.createElement("section");
    section.className = "kit-hue-group kit-hue-group--add";
    section.innerHTML = `<h4 class="kit-hue-label">Add well</h4>`;
    const row = document.createElement("div");
    row.className = "kit-hue-row";
    row.appendChild(makeAddKitWellButton(kit));
    section.appendChild(row);
    tin.appendChild(section);
  }
}

function makeKitWell(kit, index, color) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    "kit-well" +
    (color ? "" : " kit-well--empty") +
    (color && color.id === state.kitWheel.a && !state.kitWellEditMode
      ? " kit-well--wheel-a"
      : "") +
    (color && color.id === state.kitWheel.b && !state.kitWellEditMode
      ? " kit-well--wheel-b"
      : "");
  btn.dataset.slot = String(index);
  if (color) {
    btn.style.background = color.hex;
    const marks = [];
    if (color.granulating) marks.push("✦ granulating");
    if (color.mix_star) marks.push("◈ good for mix");
    btn.title = state.kitWellEditMode
      ? `${color.name_en} · tap − to remove`
      : [color.name_en, ...marks, "tap → A/B · hold → edit mode"].join(" · ");
    const removeHtml = state.kitWellEditMode
      ? `<span class="kit-well-remove" data-remove="1" aria-label="Remove ${escapeHtml(color.name_en)}">−</span>`
      : "";
    btn.innerHTML = `${removeHtml}${swatchMarksHtml(color)}<span class="kit-well-name">${escapeHtml(color.name_en)}</span>`;
  } else {
    btn.title = state.kitWellEditMode
      ? "Empty well · tap − to delete · tap + area to fill"
      : "Empty well — tap to pick a color";
    const removeHtml = state.kitWellEditMode
      ? `<span class="kit-well-remove" data-remove="1" aria-label="Remove empty well">−</span>`
      : "";
    btn.innerHTML = `${removeHtml}<span class="kit-well-plus">+</span>`;
  }

  let pressTimer = null;
  let longPressed = false;
  const clearPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = null;
  };

  btn.addEventListener("pointerdown", (e) => {
    if (!color || state.kitWellEditMode) return;
    // Don't start long-press from the remove badge
    if (e.target?.closest?.("[data-remove]")) return;
    longPressed = false;
    pressTimer = setTimeout(() => {
      longPressed = true;
      setKitWellEditMode(true);
    }, 480);
    try {
      btn.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  });
  btn.addEventListener("pointerup", (e) => {
    clearPress();
    if (longPressed) return;

    // Edit mode: − deletes the well; empty well can still fill via tap
    if (state.kitWellEditMode) {
      if (e.target?.closest?.("[data-remove]")) {
        e.preventDefault();
        e.stopPropagation();
        removeColorFromKitSlot(kit, index, color ? color.id : null);
      } else if (!color) {
        openKitPicker(index);
      }
      return;
    }

    if (color) {
      // Tap selected A/B again → unselect; else assign A then B
      if (color.id === state.kitWheel.a) {
        state.kitWheel.a = null;
        state.kitWheel.nextTap = "a";
      } else if (color.id === state.kitWheel.b) {
        state.kitWheel.b = null;
        state.kitWheel.nextTap = state.kitWheel.a ? "b" : "a";
      } else if (state.kitWheel.nextTap === "a" || !state.kitWheel.a) {
        state.kitWheel.a = color.id;
        state.kitWheel.nextTap = "b";
      } else if (!state.kitWheel.b) {
        state.kitWheel.b = color.id;
        state.kitWheel.nextTap = "a";
      } else if (state.kitWheel.nextTap === "b") {
        state.kitWheel.b = color.id;
        state.kitWheel.nextTap = "a";
      } else {
        state.kitWheel.a = color.id;
        state.kitWheel.nextTap = "b";
      }
      renderKitWheel();
      renderKitTin(kit);
    } else {
      openKitPicker(index);
    }
  });
  btn.addEventListener("pointercancel", clearPress);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
  return btn;
}

function kitColorsForWheel() {
  const kit = getActiveKit();
  if (!kit) return [];
  return kit.slots
    .map((id) => state.palette.colors.find((c) => c.id === id))
    .filter(Boolean);
}

function colorHueDeg(c) {
  try {
    return Mixing.hexToHsl(c.hex).h;
  } catch {
    return 0;
  }
}

/** Angle 0° = top (red-ish); CSS rotate clockwise from top */
function hueToWheelAngle(h) {
  return h;
}

function angleToHue(angleDeg) {
  let a = angleDeg % 360;
  if (a < 0) a += 360;
  return a;
}

function snapToKitColor(hueDeg) {
  const colors = kitColorsForWheel();
  if (!colors.length) return null;
  let best = colors[0];
  let bestDist = 999;
  colors.forEach((c) => {
    const h = colorHueDeg(c);
    let d = Math.abs(h - hueDeg);
    if (d > 180) d = 360 - d;
    // Prefer more chromatic when close
    const sat = Mixing.hexToHsl(c.hex).s;
    const score = d - sat * 0.02;
    if (score < bestDist) {
      bestDist = score;
      best = c;
    }
  });
  return best;
}

function setHandlePosition(el, hueDeg) {
  if (!el) return;
  const angle = hueToWheelAngle(hueDeg);
  el.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-96px) rotate(${-angle}deg)`;
}

/** Relative luminance 0–1 for contrast decisions (WCAG-ish) */
function hexLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0.5;
  const m = hex.replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return 0.5;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Paint A/B circle (handle or readout tag) with selected color */
function paintKitMarker(el, color) {
  if (!el) return;
  if (color?.hex) {
    el.style.background = color.hex;
    el.classList.add("is-set");
    el.classList.toggle("is-light", hexLuminance(color.hex) > 0.55);
  } else {
    el.style.background = "";
    el.classList.remove("is-set", "is-light");
  }
}

function renderKitWheel() {
  const stage = $("#kit-wheel-stage");
  if (!stage) return;
  const a = state.kitWheel.a ? state.palette.colors.find((c) => c.id === state.kitWheel.a) : null;
  const b = state.kitWheel.b ? state.palette.colors.find((c) => c.id === state.kitWheel.b) : null;
  const ha = $("#kit-wheel-handle-a");
  const hb = $("#kit-wheel-handle-b");
  const tagA = $("#kit-wheel-a-line .kit-wheel-tag");
  const tagB = $("#kit-wheel-b-line .kit-wheel-tag");

  if (a) {
    setHandlePosition(ha, colorHueDeg(a));
    paintKitMarker(ha, a);
  } else {
    setHandlePosition(ha, 0);
    paintKitMarker(ha, null);
  }
  if (b) {
    setHandlePosition(hb, colorHueDeg(b));
    paintKitMarker(hb, b);
  } else {
    setHandlePosition(hb, 120);
    paintKitMarker(hb, null);
  }
  // Readout A/B chips match the same pans (bug: were fixed rose/lavender)
  paintKitMarker(tagA, a);
  paintKitMarker(tagB, b);

  $("#kit-wheel-a-name").textContent = a
    ? `${a.name_en}${a.granulating ? " ✦" : ""}${a.mix_star ? " ◈" : ""}`
    : "—";
  $("#kit-wheel-b-name").textContent = b
    ? `${b.name_en}${b.granulating ? " ✦" : ""}${b.mix_star ? " ◈" : ""}`
    : "—";

  const swatch = $("#kit-wheel-mix-swatch");
  const label = $("#kit-wheel-mix-label");
  const note = $("#kit-wheel-note");

  if (a && b) {
    const mix = Mixing.mixColors([a, b], state.palette);
    swatch.style.background = mix.hex;
    label.textContent = mix.hueName || "mix";
    const tips = mix.tips?.length ? mix.tips[0].result : "";
    const warn = (mix.warnings || []).find((w) => {
      const t = w.text || "";
      return /complement|mud|stain|granulat/i.test(t);
    });
    const warnText = warn
      ? warn.segments
        ? warn.segments.map((s) => s.t || s.swap?.label || "").join("")
        : warn.text
      : "";
    // Prefer a short mix insight — avoid repeating how-to instructions
    note.textContent =
      tips ||
      warnText ||
      `≈ ${mix.hex.toUpperCase()} · screen guess`;
    note.hidden = false;
  } else {
    swatch.style.background = "var(--paper-deep)";
    label.textContent = "Mix";
    note.textContent = "";
    note.hidden = true;
  }

  // Keep wet-in-wet + practice card in sync when A/B change
  const kit = getActiveKit();
  if (kit) {
    renderWetInWet(kit);
    renderKitCurriculum(kit);
  }
}

function kitWheelAngleFromEvent(e, stage) {
  const rect = stage.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = e.clientX - cx;
  const y = e.clientY - cy;
  // 0 at top, clockwise — atan2(x, -y)
  let deg = (Math.atan2(x, -y) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

function bindKitWheelHandles() {
  const stage = $("#kit-wheel-stage");
  if (!stage || stage.dataset.bound) return;
  stage.dataset.bound = "1";

  const onMove = (e) => {
    if (!state.kitWheel.drag) return;
    const angle = kitWheelAngleFromEvent(e, stage);
    const snapped = snapToKitColor(angleToHue(angle));
    if (!snapped) return;
    if (state.kitWheel.drag.which === "a") state.kitWheel.a = snapped.id;
    else state.kitWheel.b = snapped.id;
    renderKitWheel();
    const kit = getActiveKit();
    if (kit) renderKitTin(kit);
  };

  const onUp = (e) => {
    if (!state.kitWheel.drag) return;
    try {
      stage.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    state.kitWheel.drag = null;
  };

  ["a", "b"].forEach((which) => {
    const el = $(`#kit-wheel-handle-${which}`);
    if (!el) return;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.kitWheel.drag = { which, pointerId: e.pointerId };
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      onMove(e);
    });
  });

  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerup", onUp);
  stage.addEventListener("pointercancel", onUp);
}

function openKitPicker(slotIndex) {
  state.kitFillSlotIndex = slotIndex;
  const sheet = $("#kit-picker-sheet");
  const search = $("#kit-picker-search");
  if (search) search.value = "";
  renderKitPickerGrid();
  sheet.showModal();
  // Don't autofocus search on iPhone — focus + small type triggers Safari page zoom
}

/** Close kit color picker and unstick iOS Safari zoom if it was focused */
function closeKitPicker() {
  const search = $("#kit-picker-search");
  if (search && document.activeElement === search) search.blur();
  else if (document.activeElement?.blur) document.activeElement.blur();
  const sheet = $("#kit-picker-sheet");
  if (sheet?.open) sheet.close();
  state.kitFillSlotIndex = null;
  // Nudge layout after dialog closes (helps some iOS versions settle scale)
  requestAnimationFrame(() => {
    window.scrollTo(window.scrollX, window.scrollY);
  });
}

/** Multi-token AND search: code, name, brand, family, hue words */
function colorMatchesSearchTokens(c, tokens) {
  if (!tokens.length) return true;
  const nameEn = (c.name_en || "").toLowerCase();
  const nameZh = (c.name_zh || "").toLowerCase();
  const brand = (c.brand || "").toLowerCase();
  const pigment = (c.pigment || "").toLowerCase();
  const code = String(c.code || "").toLowerCase();
  const codeDigits = code.replace(/\D/g, "");
  const family = (c.family || "").toLowerCase();
  const notes = (c.notes || "").toLowerCase();
  let hue = "";
  try {
    hue = String(Math.round(Mixing.hexToHsl(c.hex).h));
  } catch {
    /* ignore */
  }
  const hay = [nameEn, nameZh, brand, pigment, code, codeDigits, family, hue, notes]
    .filter(Boolean)
    .join(" ");

  const HUE_WORDS = {
    yellow: ["yellow", "gold", "ochre", "gamboge", "naples", "hansa", "azo"],
    red: ["red", "scarlet", "crimson", "carmine", "vermilion", "rose", "alizarin"],
    orange: ["orange", "coral"],
    green: ["green", "olive", "viridian", "sap", "hooker", "turquoise"],
    blue: ["blue", "ultramarine", "cerulean", "cobalt", "indigo", "cyan", "phthalo"],
    purple: ["purple", "violet", "lilac", "magenta", "mauve"],
    pink: ["pink", "rose", "opera"],
    brown: ["brown", "umber", "sienna", "earth", "sepia", "ochre"],
    grey: ["grey", "gray", "neutral", "payne", "black"],
    gray: ["grey", "gray", "neutral", "payne", "black"],
  };

  return tokens.every((tok) => {
    if (hay.includes(tok)) return true;
    // bare numbers match product codes (211, 33-107, 284600034)
    if (/^\d{2,}$/.test(tok)) {
      return codeDigits.includes(tok) || code.includes(tok);
    }
    // hue family word → family field or name synonyms
    const syns = HUE_WORDS[tok];
    if (syns) {
      if (syns.some((s) => family.includes(s) || nameEn.includes(s))) return true;
      if (family === tok) return true;
    }
    // brand shorthand
    const brandMap = {
      schmincke: "schmincke",
      sch: "schmincke",
      ds: "daniel smith",
      "daniel": "daniel",
      "m.graham": "m. graham",
      mg: "m. graham",
      graham: "m. graham",
      wn: "winsor",
      winsor: "winsor",
      windsor: "winsor",
      wna: "white nights",
      "white": "white nights",
      nights: "white nights",
      rosa: "rosa",
      maimeri: "maimeri",
      mb: "maimeri",
      pinax: "pinax",
      sennelier: "sennelier",
      sen: "sennelier",
      szmal: "roman szmal",
      "roman": "roman",
    };
    const bm = brandMap[tok];
    if (bm && brand.includes(bm)) return true;
    return false;
  });
}

function renderKitPickerGrid() {
  const raw = ($("#kit-picker-search")?.value || "").trim().toLowerCase();
  // tokens: split on whitespace / commas; ignore empties
  const tokens = raw.split(/[\s,]+/).filter(Boolean);
  let list = Mixing.sortBySpectrum(state.palette.colors);
  if (tokens.length) {
    list = list.filter((c) => colorMatchesSearchTokens(c, tokens));
  }
  const kit = getActiveKit();
  const used = new Set(kit?.slots.filter(Boolean) || []);
  renderColorGrid($("#kit-picker-grid"), list, {
    emptyMessage: tokens.length
      ? `No match for “${raw}” — try brand, code, or hue word.`
      : "No match in palette.",
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
  if (!kit || state.kitFillSlotIndex == null) return;
  if (!state.palette.colors.some((c) => c.id === colorId)) return;
  if (kit.slots.includes(colorId)) {
    showToast("Already in this kit", { type: "info", duration: 1800 });
    return;
  }

  // -1 = grow-on-demand (new well); else fill a legacy empty index
  if (state.kitFillSlotIndex === -1) {
    // Prefer reusing a null hole from older fixed-size kits, else append
    const empty = kit.slots.indexOf(null);
    if (empty >= 0) {
      kit.slots[empty] = colorId;
    } else if (kit.slots.length >= KIT_SLOT_MAX) {
      showToast(`Max ${KIT_SLOT_MAX} wells in a kit.`, { type: "info" });
      return;
    } else {
      kit.slots.push(colorId);
    }
  } else {
    if (state.kitFillSlotIndex < 0 || state.kitFillSlotIndex >= kit.slots.length) return;
    kit.slots[state.kitFillSlotIndex] = colorId;
  }
  kit.orderMode = "manual";
  state.kitFillSlotIndex = null;
  saveKits();
  closeKitPicker();
  renderKits();
  updateTabBadges();
  renderPalette();
  refreshDetailActions();
}

function arrangeActiveKitSpectrum() {
  const kit = getActiveKit();
  if (!kit) return;
  const filled = kit.slots.map((id) => state.palette.colors.find((c) => c.id === id)).filter(Boolean);
  if (filled.length < 2) {
    showToast("Add at least two colors before arranging.", { type: "info" });
    return;
  }
  const sorted = Mixing.sortBySpectrum(filled);
  // No empty padding — kit size = colors you keep
  kit.slots = sorted.map((c) => c.id);
  kit.orderMode = "spectrum";
  saveKits();
  renderKits();
  showToast("Arranged by spectrum", { type: "ok", duration: 2000 });
}

function createNewKit() {
  const name = (prompt("Kit name?", "Travel") || "").trim();
  if (!name) return;
  // No well count — start empty; add/remove wells whenever
  const kit = normalizeKit({
    id: uid(),
    name,
    layout: "grid",
    slots: [],
    personalNote: "",
    notes: "",
    orderMode: "spectrum",
  });
  state.kits.push(kit);
  setActiveKit(kit.id);
  closeKitSwitcher();
  saveKits();
  renderKits();
  updateTabBadges();
  showToast(`“${name}” ready — tap + to add wells`, { type: "ok", duration: 2400 });
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

async function deleteActiveKit() {
  const kit = getActiveKit();
  if (!kit) return;
  if (state.kits.length <= 1) {
    showToast("Keep at least one kit — or empty its wells.", { type: "info" });
    return;
  }
  if (!(await softConfirm(`Delete kit “${kit.name}”?`))) return;
  state.kits = state.kits.filter((k) => k.id !== kit.id);
  setActiveKit(state.kits[0].id);
  state.creativePoolKitIds = state.creativePoolKitIds.filter((id) => id !== kit.id);
  if (!state.creativePoolKitIds.length) state.creativePoolKitIds = [state.activeKitId];
  saveCreativeFunState();
  saveKits();
  renderKits();
  renderCreativeFun();
  updateTabBadges();
  renderPalette();
  showToast(`Deleted “${kit.name}”`, { type: "ok" });
}

function addToActiveKit(id) {
  const kit = getActiveKit();
  if (!kit || !state.palette.colors.some((c) => c.id === id)) return;
  if (kit.slots.includes(id)) return;
  const empty = kit.slots.indexOf(null);
  if (empty >= 0) {
    kit.slots[empty] = id;
  } else if (kit.slots.length >= KIT_SLOT_MAX) {
    showToast(`“${kit.name}” is full (max ${KIT_SLOT_MAX} wells).`, { type: "info" });
    return;
  } else {
    kit.slots.push(id);
  }
  kit.orderMode = "manual";
  saveKits();
  renderKits();
  renderCreativeFun();
  renderPalette();
  updateTabBadges();
  refreshDetailActions();
  showToast(`Added to ${kit.name}`, { type: "ok", duration: 1800 });
}

function removeFromActiveKit(id) {
  const kit = getActiveKit();
  if (!kit) return;
  // Remove the well entirely (same as tin −)
  kit.slots = kit.slots.filter((s) => s !== id);
  kit.orderMode = "manual";
  if (state.kitWheel.a === id) state.kitWheel.a = null;
  if (state.kitWheel.b === id) state.kitWheel.b = null;
  saveKits();
  renderKits();
  renderPalette();
  updateTabBadges();
  refreshDetailActions();
}

function refreshDetailActions() {
  if (!state.detailColor) return;
  updateDetailActionButtons(state.detailColor);
}

function getSelectedMixColors() {
  return state.selectedMixSlots.map((id) =>
    id ? state.palette.colors.find((c) => c.id === id) || null : null
  );
}

function compactMixSlots() {
  const ids = state.selectedMixSlots.filter(Boolean);
  state.selectedMixSlots = [...ids, null, null, null].slice(0, 3);
}

function applyMixSwap(replaceId, withId) {
  if (!replaceId || !withId || replaceId === withId) return;
  const target = state.palette.colors.find((c) => c.id === withId);
  if (!target) return;

  const idx = state.selectedMixSlots.indexOf(replaceId);
  if (idx < 0) return;

  const existing = state.selectedMixSlots.indexOf(withId);
  if (existing >= 0 && existing !== idx) {
    state.selectedMixSlots[existing] = null;
  }
  state.selectedMixSlots[idx] = withId;
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
    mix = Mixing.mixColors(filled, state.palette);
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
  const colors = state.mixPickerStarsOnly
    ? state.palette.colors.filter((c) => c.mix_star)
    : state.palette.colors;
  return Mixing.sortBySpectrum(colors);
}

function renderMixPicker() {
  const wrap = $("#mix-picker");
  if (!wrap) return;
  wrap.innerHTML = "";
  const toggle = $("#mix-stars-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(state.mixPickerStarsOnly));
    toggle.classList.toggle("is-active", state.mixPickerStarsOnly);
  }
  mixPickerColors().forEach((c) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className =
      "mix-chip" + (state.selectedMixSlots.includes(c.id) ? " selected" : "");
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
  "single pan": 0,
  pan: 0,
  "2ml sample": 1,
  tube: 2,
  "tube-box": 3,
};

function formatPriority(c) {
  return FORMAT_PRIORITY[c.format] ?? 5;
}

function buildVariantIndex() {
  state.variantIndex = new Map();
  state.palette.colors.forEach((c) => {
    const key = (c.name_en || "").toLowerCase();
    if (!state.variantIndex.has(key)) state.variantIndex.set(key, []);
    state.variantIndex.get(key).push(c);
  });
  state.variantIndex.forEach((list) => {
    list.sort((a, b) => {
      const byBrand = (a.brand || "").localeCompare(b.brand || "");
      if (byBrand) return byBrand;
      return formatPriority(a) - formatPriority(b);
    });
  });
}

function findColorVariants(c) {
  return state.variantIndex.get((c.name_en || "").toLowerCase()) || [];
}

function ensureMixPicker() {
  if (!state.mixPickerBuilt) {
    renderMixPicker();
    state.mixPickerBuilt = true;
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
      const col = state.palette.colors.find((x) => x.id === btn.dataset.colorId);
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
    const col = state.palette.colors.find((x) => x.id === el.dataset.colorId);
    if (col) showHueColorInfo(col, card);
  });
}

function loadMixIntoPicker(colors) {
  const ids = (colors || []).filter(Boolean).map((c) => c.id).slice(0, 3);
  state.selectedMixSlots = [...ids, null, null, null].slice(0, 3);
  state.mixPickerBuilt = false;
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
  if (!state.selectedMixSlots[index]) return;
  state.selectedMixSlots[index] = null;
  compactMixSlots();
  renderMixPicker();
}

function toggleMixColor(c) {
  const slot = state.selectedMixSlots.indexOf(c.id);
  if (slot >= 0) {
    state.selectedMixSlots[slot] = null;
    compactMixSlots();
  } else {
    const empty = state.selectedMixSlots.indexOf(null);
    if (empty < 0) return;
    state.selectedMixSlots[empty] = c.id;
  }
  renderMixPicker();
}

function locateColorInPalette(colorId) {
  const c = state.palette.colors.find((x) => x.id === colorId);
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
    const cols = ids.map((id) => state.palette.colors.find((x) => x.id === id)).filter(Boolean);
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
    groups = Mixing.findCombinations(state.palette, input);
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
          const col = state.palette.colors.find((x) => x.id === pid);
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
      const col = state.palette.colors.find((x) => x.id === btn.dataset.colorId);
      if (col) openDetail(col);
    });
  });
}

function openDetail(c) {
  state.detailColor = c;
  const sheet = $("#detail-sheet");
  const swatchEl = $("#sheet-swatch");
  swatchEl.style.background = c.hex;
  swatchEl.innerHTML = swatchMarksHtml(c);
  $("#sheet-brand").textContent = c.brand;
  $("#sheet-name-en").textContent = c.name_en;
  $("#sheet-name-zh").textContent = c.name_zh;
  $("#sheet-notes").textContent = c.notes ? `Source: ${c.notes}` : "";

  const tempRoleEl = $("#sheet-temp-role");
  if (tempRoleEl) {
    if (c.temp_role) {
      tempRoleEl.hidden = false;
      tempRoleEl.textContent = c.temp_role;
    } else {
      tempRoleEl.hidden = true;
      tempRoleEl.textContent = "";
    }
  }

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
        const col = state.palette.colors.find((x) => x.id === btn.dataset.colorId);
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
  const brandVariants = state.palette.colors.filter((x) => brandNameKey(x) === brandNameKey(c));
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
    const res = await fetchWithTimeout(
      assetUrl(`data/brands.json?v=${Date.now()}`),
      { cache: "no-store" },
      8000
    );
    if (!res.ok) return;
    const data = await res.json();
    const studioBrands = new Set(state.palette.colors.map((c) => c.brand));
    state.brandStories = (data.brands || []).filter((b) => studioBrands.has(b.name));
    if (!state.selectedBrandId || !state.brandStories.some((b) => b.id === state.selectedBrandId)) {
      state.selectedBrandId = state.brandStories[0] ? state.brandStories[0].id : null;
    }
    renderBrandChips();
    renderBrandStory();
  } catch (err) {
    console.warn("Brand stories unavailable:", err);
  }
}

function brandColorCount(name) {
  return state.palette.colors.filter((c) => c.brand === name).length;
}

function renderBrandChips() {
  const wrap = $("#brand-chips");
  if (!wrap) return;
  if (!state.brandStories.length) {
    wrap.innerHTML = '<p class="empty-state">No brand stories for your current palette yet.</p>';
    return;
  }
  wrap.innerHTML = state.brandStories
    .map((b) => {
      const active = b.id === state.selectedBrandId;
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
      : Mixing.sortBySpectrum(state.palette.colors.filter((c) => c.brand === brandName))
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
  const brand = state.brandStories.find((b) => b.id === state.selectedBrandId);
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
  if (!state.brandStories.some((b) => b.id === brandId)) return;
  state.selectedBrandId = brandId;
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
  state.selectedMixSlots = [null, null, null];
  state.mixPickerStarsOnly = false;
  setActiveColorLinks(null);
  renderMixPicker();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetKitsPanel() {
  const sheet = $("#detail-sheet");
  if (sheet?.open) sheet.close();
  const picker = $("#kit-picker-sheet");
  if (picker?.open) picker.close();
  closeKitSwitcher();
  renderKits();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAddPanel() {
  if (!state.editingColorId) return;
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
  if (target === "add" && !state.editingColorId) {
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

  $("#search")?.addEventListener("input", renderPalette);
  $("#brand-filter")?.addEventListener("change", renderPalette);
  $("#family-filter")?.addEventListener("change", renderPalette);
  $("#toxicity-filter")?.addEventListener("change", renderPalette);
  $("#format-filter")?.addEventListener("change", renderPalette);
  $("#creative-shuffle")?.addEventListener("click", shuffleCreativeFun);
  $("#creative-to-mix")?.addEventListener("click", sendCreativeTrioToMixLab);
  $("#creative-mode-select")?.addEventListener("change", (e) => {
    state.creativeMode = e.target.value || "play";
    saveCreativeFunState();
    drawCreativeTrio(true);
    renderCreativeFun();
  });
  $("#creative-kit-dd-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const panel = $("#creative-kit-dd");
    const btn = $("#creative-kit-dd-btn");
    if (!panel || !btn) return;
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    if (open) {
      closeKitSwitcher();
      renderCreativeKitDropdown();
    }
  });
  $("#kit-switcher-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeCreativeKitDropdown();
    toggleKitSwitcher();
  });
  document.addEventListener("click", (e) => {
    const creativeField = e.target?.closest?.(".creative-field--kits");
    if (!creativeField) closeCreativeKitDropdown();
    const kitSwitch = e.target?.closest?.("#kit-switcher");
    if (!kitSwitch) closeKitSwitcher();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeKitSwitcher();
      closeCreativeKitDropdown();
    }
  });
  $("#kit-note-toggle")?.addEventListener("click", () => {
    const body = $("#kit-note-body");
    const btn = $("#kit-note-toggle");
    if (!body || !btn) return;
    const open = body.hidden;
    body.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  });
  $("#kit-note-personal")?.addEventListener("input", saveActiveKitPersonalNote);
  $("#kit-note-personal")?.addEventListener("change", saveActiveKitPersonalNote);
  $("#water-lab-color")?.addEventListener("change", (e) => {
    state.waterLabColorId = e.target.value || null;
    const kit = getActiveKit();
    if (kit) {
      renderWaterLab(kit);
      renderKitCurriculum(kit);
    }
  });
  $("#wet-lab-scroll-wheel")?.addEventListener("click", () => {
    const stage = $("#kit-wheel-stage") || $(".kit-wheel-section");
    stage?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("#kit-practice-shuffle")?.addEventListener("click", shufflePracticeCard);
  $("#palette-read-toggle")?.addEventListener("click", togglePaletteRead);
  $("#kit-edit-done")?.addEventListener("click", () => setKitWellEditMode(false));
  $("#mix-clear")?.addEventListener("click", () => {
    state.selectedMixSlots = [null, null, null];
    renderMixWorkspace();
    renderMixPicker();
  });
  $("#mix-stars-toggle")?.addEventListener("click", () => {
    state.mixPickerStarsOnly = !state.mixPickerStarsOnly;
    renderMixPicker();
  });
  $("#hue-search-btn")?.addEventListener("click", runHueSearch);
  $("#hue-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runHueSearch();
  });

  $("#sheet-current-btn")?.addEventListener("click", () => {
    if (!state.detailColor) return;
    if (colorInActiveKit(state.detailColor.id)) removeFromActiveKit(state.detailColor.id);
    else addToActiveKit(state.detailColor.id);
  });

  $("#kit-add-btn")?.addEventListener("click", createNewKit);
  $("#kit-arrange-btn")?.addEventListener("click", arrangeActiveKitSpectrum);
  $("#kit-rename-btn")?.addEventListener("click", renameActiveKit);
  $("#kit-delete-btn")?.addEventListener("click", deleteActiveKit);
  bindKitWheelHandles();
  $("#kit-picker-search")?.addEventListener("input", renderKitPickerGrid);
  // Tap dimmed backdrop (outside sheet-inner) to close picker — no × button
  $("#kit-picker-sheet")?.addEventListener("click", (e) => {
    if (e.target === $("#kit-picker-sheet")) closeKitPicker();
  });
  $("#kit-picker-sheet")?.addEventListener("cancel", () => {
    closeKitPicker();
  });
  $("#kit-picker-sheet")?.addEventListener("close", () => {
    const search = $("#kit-picker-search");
    search?.blur();
  });
  $("#sheet-remove-btn")?.addEventListener("click", () => {
    if (!state.detailColor) return;
    removeColorFromStudio(state.detailColor.id);
  });
  $("#sheet-edit-btn")?.addEventListener("click", () => {
    if (!state.detailColor) return;
    startEditColor(state.detailColor);
  });
  $("#color-form")?.addEventListener("submit", saveColorFromForm);
  $("#color-form-cancel")?.addEventListener("click", () => {
    fillColorForm(null);
    clearFormStatus();
    switchTab("palette");
  });
  $("#f-hex-picker")?.addEventListener("input", () => {
    if ($("#f-hex")) $("#f-hex").value = $("#f-hex-picker").value.toUpperCase();
    updateFormSwatchPreview();
  });
  $("#f-hex")?.addEventListener("input", () => {
    const v = $("#f-hex").value.trim();
    const hex = v.startsWith("#") ? v : `#${v}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex) && $("#f-hex-picker")) {
      $("#f-hex-picker").value = hex;
    }
    updateFormSwatchPreview();
  });
  updateFormSwatchPreview();
  $("#sheet-close")?.addEventListener("click", () => {
    state.detailColor = null;
    $("#detail-sheet")?.close();
  });
  $("#detail-sheet")?.addEventListener("click", (e) => {
    if (e.target === $("#detail-sheet")) {
      state.detailColor = null;
      $("#detail-sheet").close();
    }
  });

  $("#sync-save-passphrase")?.addEventListener("click", saveSyncPassphrase);
  $("#sync-now-btn")?.addEventListener("click", syncNow);
  $("#sync-export-btn")?.addEventListener("click", exportStudioFile);
  $("#sync-import-input")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) importStudioFile(file);
    e.target.value = "";
  });

  $("#brand-chips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".brand-chip");
    if (!chip?.dataset.brandId) return;
    selectBrand(chip.dataset.brandId);
  });

  $("#brand-story")?.addEventListener("click", (e) => {
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