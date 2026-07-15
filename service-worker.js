const CACHE_NAME = "mein-deutsch-v2-shell-1";
const APP_SHELL = [
  "./", "./index.html", "./manifest.json", "./css/style.css",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./js/core/constants.js", "./js/core/storage.js", "./js/core/srs.js",
  "./js/core/progression.js", "./js/core/stats.js", "./js/core/backup.js", "./js/core/router.js",
  "./js/models/profil.model.js", "./js/models/vocabulaire.model.js", "./js/models/expressions.model.js",
  "./js/models/phrasesModeles.model.js", "./js/models/grammaire.model.js", "./js/models/conjugaison.model.js",
  "./js/models/phonetique.model.js", "./js/models/hoeren.model.js", "./js/models/lesen.model.js",
  "./js/models/schreiben.model.js", "./js/models/sprechen.model.js", "./js/models/bibliothequeDialogues.model.js",
  "./js/models/examens.model.js", "./js/models/pflege.model.js", "./js/models/vivreEnAllemagne.model.js",
  "./js/models/revision.model.js", "./js/models/dictionnairePersonnel.model.js", "./js/models/carnetVerbes.model.js",
  "./js/models/tableauDeBord.model.js",
  "./js/ui/registre-modules.js", "./js/ui/screens.js", "./js/ui/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      })).catch(() => caches.match("./index.html"))
    );
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
