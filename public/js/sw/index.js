const v1_name = 'wittr-static-v1';
const v2_name = v1_name.replace('v1', 'v2');

self.addEventListener('install', event => {

  event.waitUntil(
    caches.open(v2_name)
        .then(cache => cache.addAll([
      '/',
      'js/main.js',
      'css/main.css',
      'imgs/icon.png',
      'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
      'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
    ]))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
      caches.delete(v1_name)
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
