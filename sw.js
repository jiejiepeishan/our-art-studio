const CACHE = "our-art-studio-v76";
const FETCH_TIMEOUT_MS = 4000;
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
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/mixing.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  ...BRAND_IMAGES,
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isPaletteJson(url) {
  return url.pathname.endsWith("palette.json") || url.pathname.endsWith("brands.json");
}

function isBrandImage(url) {
  return url.pathname.startsWith("/images/brands/");
}

function isAppAsset(url) {
  return (
    isPaletteJson(url) ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  );
}

function fetchWithTimeout(request, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for bundled brand demo art (offline Brands Story)
  if (isBrandImage(url)) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // Network-first for app code + palette so updates always land
  if (isAppAsset(url)) {
    e.respondWith(
      (async () => {
        try {
          const res = await fetchWithTimeout(e.request, FETCH_TIMEOUT_MS);
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        } catch {
          const cached = await caches.match(e.request);
          if (cached) return cached;
          throw new Error("offline");
        }
      })()
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});