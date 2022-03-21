const APP_PREFIX = 'MoneyTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// use the self keyword to instantiate listeners on the service worker.
// The context of self here refers to the service worker object.
self.addEventListener('install', function (e) {

})

const FILES_TO_CACHE = [
    "./models/transaction.js",
    "./public/css/style.css",
    "./public/js/idb.js",
    "./public/js/index.js",
    "./public/js/index.html",
    "./routes/api.js",
    "./server.js"
]
