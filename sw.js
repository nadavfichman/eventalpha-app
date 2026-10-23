// EventAlpha — minimal service worker, only for Web Push notifications.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { /* ignore malformed payload */ }

  const title = data.title || 'EventAlpha';
  const icon  = new URL('logo192.png', self.registration.scope).href;

  event.waitUntil(
    self.registration.showNotification(title, {
      body:  data.body || '',
      icon,
      badge: icon,
      data:  { url: data.url || self.registration.scope },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || self.registration.scope;
  event.waitUntil(self.clients.openWindow(url));
});
