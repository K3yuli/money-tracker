const APP_PREFIX = 'MoneyTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


const FILES_TO_CACHE = [
    "./models/transaction.js",
    "./public/css/style.css",
    "./public/js/idb.js",
    "./public/js/index.js",
    "./public/js/index.html",
    "./routes/api.js",
    "./server.js"
]

// use the self keyword to instantiate listeners on the service worker.
// The context of self here refers to the service worker object.
self.addEventListener('install', function (e) {
    e.awaitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache :' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('active', function(e) {
    e.awaitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        
    )
})


