import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import webpush from 'web-push';
const R=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),D=process.env.DATA_DIR||path.join(R,'server'),VF=path.join(D,'vapid.json'),SF=path.join(D,'subs.json');
const rd=(f,d)=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return d}};
let V=process.env.VAPID_PUBLIC&&process.env.VAPID_PRIVATE?{publicKey:process.env.VAPID_PUBLIC,privateKey:process.env.VAPID_PRIVATE}:rd(VF,null);
if(!V){V=webpush.generateVAPIDKeys();fs.mkdirSync(D,{recursive:true});fs.writeFileSync(VF,JSON.stringify(V))}
webpush.setVapidDetails(process.env.VAPID_SUBJECT||'mailto:admin@example.com',V.publicKey,V.privateKey);
const subs=rd(SF,{}),persist=()=>{try{fs.writeFileSync(SF,JSON.stringify(subs))}catch(e){console.error(e)}};
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/manifest+json'};
const OK=/^\/(index\.html|app\.js|styles\.css|service-worker\.js|manifest\.json|(src|icons|public)\/[\w./-]+)$/;
const mins=t=>+t.slice(0,2)*60+ +t.slice(3,5);
function local(tz){try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return {date:`${p.year}-${p.month}-${p.day}`,t:`${p.hour}:${p.minute}`}}catch{return null}}
setInterval(async()=>{for(const [ep,s] of Object.entries(subs)){const n=local(s.tz);if(!n)continue;const d=mins(n.t)-mins(s.time);if(d<0||d>10||s.last===n.date)continue;
 try{await webpush.sendNotification(s.sub,JSON.stringify({title:'FitPulse workout',body:"Time to train. Open FitPulse for today's muscles."}));s.last=n.date;persist()}catch(e){if(e.statusCode===404||e.statusCode===410){delete subs[ep];persist()}else console.error(e.message)}}},30000);
const body=req=>new Promise((ok,no)=>{let b='';req.on('data',c=>{b+=c;if(b.length>20000){no(new Error('big'));req.destroy()}});req.on('end',()=>ok(b))});
http.createServer(async(req,res)=>{const u=new URL(req.url,'http://x');let p=u.pathname==='/'?'/index.html':u.pathname;
 const send=(c,t,b)=>{res.writeHead(c,{'content-type':t,'x-content-type-options':'nosniff'});res.end(b)};
 try{if(p==='/api/vapid')return send(200,'application/json',JSON.stringify({key:V.publicKey}));
 if(p==='/api/subscribe'&&req.method==='POST'){const j=JSON.parse(await body(req)),ep=j.sub?.endpoint;
  if(typeof ep!=='string'||!ep.startsWith('https://')||!/^\d\d:\d\d$/.test(j.time)||!local(j.tz))return send(400,'text/plain','bad request');
  subs[ep]={sub:j.sub,time:j.time,tz:j.tz,last:subs[ep]?.last};persist();return send(200,'application/json','{"ok":true}')}
 if(p==='/api/unsubscribe'&&req.method==='POST'){const j=JSON.parse(await body(req));delete subs[j.endpoint];persist();return send(200,'application/json','{"ok":true}')}
 if(!OK.test(p)||p.includes('..'))return send(404,'text/plain','not found');
 const f=path.join(R,p);send(200,MIME[path.extname(f)]||'application/octet-stream',fs.readFileSync(f))}catch(e){send(e.code==='ENOENT'?404:400,'text/plain','error')}
}).listen(process.env.PORT||8080,()=>console.log('FitPulse on :'+(process.env.PORT||8080)));
