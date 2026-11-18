// Nishi Express service worker: always asks the network first, so a new index.html shows up right away.
// The saved copy is only used when the phone is offline.
const CACHE = 'nishi-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || /\.mp3$/i.test(e.request.url)) return;   // let the browser stream the music itself
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./')))
  );
});
