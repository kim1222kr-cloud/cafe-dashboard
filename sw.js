/* 서비스 워커 — 오프라인에서도 마지막 화면이 뜨게 하고, 시트 데이터는 항상 새로 가져온다.
   같은 GitHub 계정의 다른 대시보드(같은 주소)의 캐시는 건드리지 않는다. 버전을 올리면 이전 캐시가 정리된다. */
const VER = 'cafe-dash-v1';
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './favicon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.indexOf('cafe-dash-') === 0 && k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 구글 시트 데이터는 캐시하지 않는다 — 늘 최신이어야 한다
  if (/(^|\.)docs\.google\.com$/.test(url.hostname) || /googleusercontent\.com$/.test(url.hostname)) return;

  const own = url.origin === location.origin;
  // 화면·코드는 네트워크 우선(새 버전이 바로 반영), 실패하면 캐시
  if (req.mode === 'navigate' || (own && (/\.(html|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/')))) {
    e.respondWith(
      (req.mode === 'navigate' ? fetch(req) : fetch(req, {cache: 'no-cache'}))
        .then(r => { if (r && r.ok) { const c = r.clone(); caches.open(VER).then(x => x.put(req, c)); } return r; })
        .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // 아이콘·글꼴은 캐시 우선
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      if (res && res.status === 200 && (own || /jsdelivr|gstatic|googleapis/.test(url.hostname))) {
        const c = res.clone(); caches.open(VER).then(x => x.put(req, c));
      }
      return res;
    }))
  );
});
