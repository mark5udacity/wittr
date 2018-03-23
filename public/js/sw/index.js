self.addEventListener('fetch', function(event) {
	// TODO: respond to all requests with an html response
	// containing an element with.
	// Ensure the Content-Type of the response is "text/html"
  event.respondWith(
      new Response('Hello, <b class="a-winner-is-me">World!</b>', {
        headers: {'Content-Type': 'text/html; charset=utf-8'}
      })
  );
});
