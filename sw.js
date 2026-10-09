const ROOT=new URL('./',self.location.href).href;
const PREFIX='tap-pop-shell-'+new URL(ROOT).pathname+'-';
const CACHE=PREFIX+'v29';
const SHELL=new URL('index.html',ROOT).href;
self.addEventListener('install',event=>{event.waitUntil((async()=>{const c=await caches.open(CACHE);for(const path of ['index.html','manifest.webmanifest','icon.svg']){const key=new URL(path,ROOT);const fresh=new URL(key);fresh.searchParams.set('_v','27-'+Date.now());const r=await fetch(fresh.href,{cache:'no-store'});if(!r.ok)throw Error('Offline file unavailable');await c.put(key.href,r)}await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();const clients=await self.clients.matchAll({type:'window'});for(const c of clients)c.postMessage({type:'POP_UPDATE',version:'28'})})())});
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(ROOT))return;
 // Version probes must never get an old offline shell disguised as a fresh response.
 if(u.searchParams.has('_v')){event.respondWith(fetch(event.request,{cache:'no-store'}));return}
 if(event.request.mode==='navigate'&&(u.pathname===new URL(ROOT).pathname||u.pathname===new URL(SHELL).pathname)){event.respondWith((async()=>{try{const r=await fetch((()=>{const f=new URL(event.request.url);f.searchParams.set('_v',Date.now());return f.href})(),{cache:'no-store'});if(r.ok){const c=await caches.open(CACHE);await c.put(SHELL,r.clone())}return r}catch{const c=await caches.open(CACHE);return await c.match(SHELL)||Response.error()}})());return}
 if(['icon.svg','icon-192.png','icon-512.png','manifest.webmanifest'].some(f=>u.href===new URL(f,ROOT).href)){event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));}
});
