/**
 * Studio persistence — localStorage, userData, kits I/O, sync bundle.
 * Does not own live app state; app.js still holds the `let`s (step 2).
 */
const StudioData = (() => {
  const STORAGE = {
    current: "our-art-studio-current", // legacy, cleared on migrate
    kits: "our-art-studio-kits-v1",
    activeKit: "our-art-studio-active-kit",
    todays: "our-art-studio-todays-palette", // legacy daily full-palette draw
    creative: "our-art-studio-creative-fun-v1",
    userData: "our-art-studio-user-data",
    syncPassphrase: "our-art-studio-sync-passphrase",
    lastSyncedAt: "our-art-studio-last-synced-at",
  };

  const SYNC_BUNDLE_VERSION = 2;

  const EMPTY_USER_DATA = () => ({ removed: [], added: [], overrides: {} });

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

  function parseUserData(parsed) {
    if (!parsed || typeof parsed !== "object") return EMPTY_USER_DATA();
    return {
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
      added: Array.isArray(parsed.added) ? parsed.added : [],
      overrides:
        parsed.overrides && typeof parsed.overrides === "object" ? parsed.overrides : {},
    };
  }

  function loadUserData() {
    try {
      const raw = localStorage.getItem(STORAGE.userData);
      if (!raw) return EMPTY_USER_DATA();
      return parseUserData(JSON.parse(raw));
    } catch {
      return EMPTY_USER_DATA();
    }
  }

  function saveUserData(userData) {
    localStorage.setItem(STORAGE.userData, JSON.stringify(userData));
  }

  function mergeColorEntry(base, override) {
    if (!override) return { ...base };
    const merged = { ...base, ...override };
    if (override.mix_tips === undefined) merged.mix_tips = base.mix_tips;
    if (override.brand_traits === undefined) merged.brand_traits = base.brand_traits;
    return merged;
  }

  function applyUserChanges(basePalette, userData) {
    const removed = new Set(userData.removed);
    const colors = [];
    (basePalette.colors || []).forEach((c) => {
      if (removed.has(c.id)) return;
      colors.push(mergeColorEntry(c, userData.overrides[c.id]));
    });
    userData.added.forEach((c) => {
      if (!removed.has(c.id)) colors.push({ ...c });
    });
    return { colors, color_count: colors.length };
  }

  function buildSyncBundle({ userData, kits, activeKitId, revision }) {
    return {
      version: SYNC_BUNDLE_VERSION,
      updatedAt: Date.now(),
      revision,
      userData: {
        removed: [...userData.removed],
        added: userData.added.map((c) => ({ ...c })),
        overrides: { ...userData.overrides },
      },
      kits: kits.map((k) => ({
        ...k,
        slots: [...k.slots],
        personalNote: k.personalNote || k.notes || "",
        notes: k.personalNote || k.notes || "",
      })),
      activeKitId,
    };
  }

  function readSyncBundle(bundle) {
    if (!bundle?.userData) return null;
    return {
      userData: parseUserData(bundle.userData),
      kits: Array.isArray(bundle.kits) && bundle.kits.length ? bundle.kits : null,
      activeKitId: bundle.activeKitId || null,
      revision: bundle.revision || 0,
      updatedAt: bundle.updatedAt || null,
    };
  }

  function saveKits(kits, activeKitId) {
    try {
      localStorage.setItem(STORAGE.kits, JSON.stringify(kits));
      if (activeKitId) localStorage.setItem(STORAGE.activeKit, activeKitId);
    } catch {
      /* ignore quota */
    }
  }

  function loadKitsRaw() {
    try {
      const loaded = JSON.parse(localStorage.getItem(STORAGE.kits) || "[]");
      return Array.isArray(loaded) ? loaded : [];
    } catch {
      return [];
    }
  }

  function loadActiveKitId() {
    return localStorage.getItem(STORAGE.activeKit);
  }

  function loadCreativeFunRaw() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.creative) || "null");
    } catch {
      return null;
    }
  }

  function saveCreativeFunState(payload) {
    try {
      localStorage.setItem(STORAGE.creative, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }

  function clearLegacyLists() {
    localStorage.removeItem(STORAGE.current);
    localStorage.removeItem("our-art-studio-wishlist");
  }

  function getSavedPassphrase() {
    return localStorage.getItem(STORAGE.syncPassphrase) || "";
  }

  function savePassphrase(phrase) {
    localStorage.setItem(STORAGE.syncPassphrase, phrase);
  }

  function getLastSyncedAt() {
    return localStorage.getItem(STORAGE.lastSyncedAt);
  }

  function setLastSyncedAt(ts) {
    localStorage.setItem(STORAGE.lastSyncedAt, String(ts));
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

  return {
    STORAGE,
    SYNC_BUNDLE_VERSION,
    loadStoredIds,
    saveStoredIds,
    parseUserData,
    loadUserData,
    saveUserData,
    mergeColorEntry,
    applyUserChanges,
    buildSyncBundle,
    readSyncBundle,
    saveKits,
    loadKitsRaw,
    loadActiveKitId,
    loadCreativeFunRaw,
    saveCreativeFunState,
    clearLegacyLists,
    getSavedPassphrase,
    savePassphrase,
    getLastSyncedAt,
    setLastSyncedAt,
    sha256HexBytes,
    hashPassphrase,
  };
})();
