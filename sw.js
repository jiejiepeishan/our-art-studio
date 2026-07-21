/* Our Art Studio — service worker (GitHub Pages project site safe) */
const CACHE = "our-art-studio-v87";
const FETCH_TIMEOUT_MS = 12000;

/** Core shell — must install for offline. Failures here are serious. */
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/mixing.js",
  "./data/palette.json",
  "./data/brands.json",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

/** Optional brand demo art — never block SW install if one 404s */
const BRAND_IMAGES = [
  "./images/brands/aivazovsky-ivan-the-ninth-wave.jpg",
  "./images/brands/albrecht-d-c3-bcrer-das-gro-c3-9fe-rasenst-c3-bcck.jpg",
  "./images/brands/bonnard-paysage-normand.jpg",
  "./images/brands/c-c3-a9zanne-montagne-sainte-victoire-tate.jpg",
  "./images/brands/canaletto-grand-canal-from-palazzo-flangini-jpgm.jpg",
  "./images/brands/czerwona-parasolka-by-j-zef-mehoffer.jpg",
  "./images/brands/emil-nolde-sera-d-estate-1903.jpg",
  "./images/brands/giovanni-boldini-an-elegant-lady.jpg",
  "./images/brands/ilya-repin-what-freedom.jpg",
  "./images/brands/j-m-w-turner-the-piazzetta-2c-venice-2c-1840-watercolour.jpg",
  "./images/brands/j-m-w-turner-the-piazzetta-venice-1840-watercolour.jpg",
  "./images/brands/jean-sim-on-chardin-still-life-with-jar-of-olives-wga04777.jpg",
  "./images/brands/kuindzhi-moonlit-night-on-the-dnieper-1880-grm-x2.jpg",
  "./images/brands/matisse-woman-with-a-hat.jpg",
  "./images/brands/nicholas-roerich-guests-from-overseas.jpg",
  "./images/brands/paul-klee-kleine-schweizerlandschaft-1920.jpg",
  "./images/brands/sargent-muddy-alligators.jpg",
  "./images/brands/stanis-aw-wyspia-ski-macierzy-stwo.jpg",
  "./images/brands/taras-shevchenko-ts13.jpg",
  "./images/brands/the-blue-boat-1892-winslow-homer.jpg",
  "./images/brands/vassily-kandinsky-2c-1913-color-study-2c-squares-with-concentric-circles.jpg",
  "./images/brands/winslow-homer-an-adirondack-lake.jpg",
  "./images/brands/winslow-homer-autumn-foliage-with-two-youths-fishing-c-1878.jpg",
];

async function cacheAllSettled(cache, urls) {
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "reload" });
        if (res.ok) await cache.put(url, res);
      } catch {
        /* skip missing / flaky optional assets */
      }
    })
  );
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Core first (best effort — still don't hard-fail the whole SW)
      await cacheAllSettled(cache, CORE_ASSETS);
      // Brand art in background of install
      await cacheAllSettled(cache, BRAND_IMAGES);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function pathEndsWith(pathname, suffix) {
  return pathname.endsWith(suffix);
}

function isPaletteJson(url) {
  return (
    pathEndsWith(url.pathname, "palette.json") ||
    pathEndsWith(url.pathname, "brands.json")
  );
}

function isBrandImage(url) {
  // Project Pages: /our-art-studio/images/brands/...
  return url.pathname.includes("/images/brands/");
}

function isAppAsset(url) {
  return (
    isPaletteJson(url) ||
    pathEndsWith(url.pathname, ".html") ||
    pathEndsWith(url.pathname, ".js") ||
    pathEndsWith(url.pathname, ".css") ||
    pathEndsWith(url.pathname, "manifest.json")
  );
}

function fetchWithTimeout(request, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(request, { signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

async function networkFirst(request) {
  try {
    const res = await fetchWithTimeout(request, FETCH_TIMEOUT_MS);
    if (res && res.ok) {
      const clone = res.clone();
      caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Try bare pathname without query string
    const url = new URL(request.url);
    url.search = "";
    const cachedClean = await caches.match(url.pathname);
    if (cachedClean) return cachedClean;
    // Last resort: match by ending
    const all = await caches.open(CACHE).then((c) => c.keys());
    for (const key of all) {
      if (key.url.split("?")[0] === request.url.split("?")[0]) {
        const hit = await caches.match(key);
        if (hit) return hit;
      }
    }
    throw new Error("offline");
  }
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Never cache / mess with API (local sync only)
  if (url.pathname.includes("/api/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Only handle same-origin
  if (url.origin !== self.location.origin) {
    return;
  }

  if (isBrandImage(url)) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request)
            .then((res) => {
              if (res.ok) {
                const clone = res.clone();
                caches.open(CACHE).then((c) => c.put(e.request, clone));
              }
              return res;
            })
            .catch(() => cached)
      )
    );
    return;
  }

  // Network-first for app shell + data so updates land; fall back to cache
  if (isAppAsset(url) || e.request.mode === "navigate") {
    e.respondWith(networkFirst(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
