// Ioniq Monitorius: keep the app usable without internet (network first, cached copy as fallback)
const CACHE = 'ioniq-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./']))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const key = u.origin + u.pathname;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && (u.pathname.endsWith('/') || u.pathname.endsWith('index.html'))){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(key, cp)); }
      return r;
    }).catch(() => caches.match(key).then(m => m || caches.match('./')))
  );
});
