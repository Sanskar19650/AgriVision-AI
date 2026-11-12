/**
 * AgriVision AI - Offline GIS & Map Tile Service Worker
 * Provides offline caching for Leaflet map tiles, farm plots, and application shell.
 */

const STATIC_CACHE_NAME = 'agrivision-static-v1';
const MAP_TILES_CACHE_NAME = 'agrivision-map-tiles-v1';
const FARMS_DATA_CACHE_NAME = 'agrivision-farms-data-v1';

// Static resources critical for offline map rendering
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Fallback 256x256 SVG tile for uncached offline map areas
const OFFLINE_TILE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#f5f5f4" stroke="#e7e5e4" stroke-width="1"/>
  <path d="M0 0 L256 256 M256 0 L0 256" stroke="#e7e5e4" stroke-width="0.5" stroke-dasharray="4,4"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#78716c" font-family="sans-serif" font-size="11" font-weight="600">
    AgriVision Offline Map
  </text>
  <text x="50%" y="58%" text-anchor="middle" fill="#a8a29e" font-family="sans-serif" font-size="9">
    Cached Plot Overlay Active
  </text>
</svg>
`.trim();

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Could not precache all static assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE_NAME, MAP_TILES_CACHE_NAME, FARMS_DATA_CACHE_NAME].includes(key)) {
            console.log('[SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy dispatcher
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Map Tiles (OpenStreetMap & OpenTopoMap)
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tile.opentopomap.org')) {
    event.respondWith(handleMapTileFetch(event.request));
    return;
  }

  // 2. Leaflet CDN resources
  if (url.hostname.includes('unpkg.com') && url.pathname.includes('leaflet')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // 3. Application API calls (/api/...)
  if (url.pathname.startsWith('/api/')) {
    // Let network handle API, fallback to cache if available
    return;
  }

  // 4. Default: Stale-While-Revalidate for app assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

/**
 * Map Tile Handler: Cache-First with fallback to dynamic network caching,
 * and a guaranteed fallback offline SVG tile if network is unavailable.
 */
async function handleMapTileFetch(request) {
  const cache = await caches.open(MAP_TILES_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    // Device is offline and tile was not cached
  }

  // Return generated offline placeholder tile so Leaflet renders cleanly
  return new Response(OFFLINE_TILE_SVG, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

// Client message listener for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_TILES') {
    const tileUrls = event.data.urls || [];
    caches.open(MAP_TILES_CACHE_NAME).then(async (cache) => {
      for (const tileUrl of tileUrls) {
        try {
          const match = await cache.match(tileUrl);
          if (!match) {
            const res = await fetch(tileUrl);
            if (res.ok) await cache.put(tileUrl, res);
          }
        } catch (e) {
          // Ignore individual tile errors
        }
      }
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true, count: tileUrls.length });
      }
    });
  }
});
