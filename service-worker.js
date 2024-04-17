const CACHE_NAME = 'app-v2';
const urlsToCache = [
  '',
  'index.html',
  'home.html',
  'manifest.json',
  'icon.png',
  'css/portal.css',
  'js/main.js',
  'js/database.js',
  'js/portal.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // No cache match, fetch resource from network
        return fetch(event.request)
          .then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response stream to store in cache
            var responseToCache = response.clone();

            // Update cache with the latest version
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['app-v2', 'app-v3']; // Add new versions as they are released

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


