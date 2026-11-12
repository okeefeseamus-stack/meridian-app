// Keeps the app shell on the phone so Meridian opens instantly, even with no signal.
// The news itself is fetched fresh from Apps Script on every open and never cached here.
const VERSION = "meridian-v2";
const SHELL = [
  "./", "index.html", "config.js", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png", "favicon-64.png",
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `meridian-0${n}.png`),
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Apps Script (the news + send button): always live, never cached
  if (url.hostname.endsWith("google.com") || url.hostname.endsWith("googleusercontent.com")) return;

  // Fonts: serve from cache, refresh in the background
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com")) {
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      const fresh = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || fresh;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // The page and config: network first so updates show up, cache when offline.
  // ignoreSearch because the app link carries ?k=...
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("config.js")) {
    e.respondWith(
      fetch(req)
        .then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(url.pathname.endsWith("config.js") ? req : "index.html", copy)); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
    );
    return;
  }

  // Everything else (icons, logos): cache first
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
});
