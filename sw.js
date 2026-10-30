// オフライン閲覧用 Service Worker(index.html と同じフォルダに置く)
// オンライン時は常に最新を取得し、オフライン時は保存済みのコピーを表示します。
const CACHE = "kenkyu-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.status === 200 && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./"))
    )
  );
});
