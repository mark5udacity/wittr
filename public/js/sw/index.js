self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
        .then(response => {
          if (response.status === 404) {
            return fetch('/imgs/dr-evil.gif');
          }
          return response;
        }).catch(() => new Response("Uh oh, that totally failed!"))
  );
});
