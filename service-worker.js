const CACHE_NAME = 'screen-light-v1';
// उन फ़ाइलों की सूची जिन्हें ऐप को चलाने के लिए कैश करने की आवश्यकता है।
const urlsToCache = [
  'index.html',
  'manifest.webmanifest',
  // ध्यान दें: आपको Tailwind CSS CDN को सीधे कैश करने की आवश्यकता नहीं है क्योंकि यह कैशिंग के मुद्दों का कारण बन सकता है।
  // ब्राउज़र आमतौर पर इसे वैसे भी कैश कर लेता है।
];

// इंस्टॉल इवेंट: संपत्ति (assets) को कैश करें
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// फ़ेच इवेंट: कैश की गई संपत्ति को परोसें
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // अगर कैश में है, तो वहीं से जवाब दें
        if (response) {
          return response;
        }
        // अन्यथा, नेटवर्क से फ़ेच करें
        return fetch(event.request);
      }
    )
  );
});

// सक्रियण इवेंट: पुराने कैश को हटा दें
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});