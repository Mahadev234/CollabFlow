// Import and configure Firebase
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBe_DPjZSebuFMxLRT4iklx5l-4dyNyZr0",
  authDomain: "collabflow-882bf.firebaseapp.com",
  projectId: "collabflow-882bf",
  storageBucket: "collabflow-882bf.firebasestorage.app",
  messagingSenderId: "72535795631",
  appId: "1:72535795631:web:889998bb4643c1d9dd715a"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  // Get notification preferences from payload
  const preferences = payload.data?.preferences || {
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true
  };

  // Customize notification options
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    vibrate: preferences.vibrationEnabled ? [100, 50, 100] : undefined,
    requireInteraction: payload.data?.requireInteraction || false,
    actions: payload.data?.actions || [],
    data: payload.data,
    tag: payload.data?.tag || 'default',
    renotify: payload.data?.renotify || false,
    silent: !preferences.soundEnabled
  };

  // Show notification
  return self.registration.showNotification(
    payload.notification.title,
    notificationOptions
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  
  // Close the notification
  event.notification.close();

  // Get the URL from the notification data
  const urlToOpen = event.notification.data?.url || '/';

  // Handle different actions
  if (event.action) {
    // Handle custom actions
    console.log('Action clicked:', event.action);
    // You can add specific handling for different actions here
  } else {
    // Default click behavior
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed', event);
  // You can add cleanup or analytics here
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Unhandled Rejection:', event);
}); 