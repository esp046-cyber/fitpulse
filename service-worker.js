const C='fitpulse-v3',A=['./','index.html','manifest.json','styles.css','app.js','src/data.js','src/muscles.js','icons/icon.svg','icons/icon-192.png','public/offline.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).pathname.startsWith('/api/'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c2=n.clone();caches.open(C).then(c=>c.put(e.request,c2));return n}).catch(()=>caches.match('public/offline.html'))))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{}e.waitUntil(self.registration.showNotification(d.title||'FitPulse',{body:d.body||'Time to train.',icon:'icons/icon-192.png',badge:'icons/icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./'))});
