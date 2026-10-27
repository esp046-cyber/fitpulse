import {MUSCLES,bodySVG,icon} from './src/muscles.js';import {PROGRAM,DAYS,volume} from './src/data.js';
const $=s=>document.querySelector(s),K='fitpulse.v1',today=()=>new Date().toISOString().slice(0,10);
let S={week:1,day:(new Date().getDay()+6)%7,tab:'train',hist:[],w:{},set:{theme:'auto',haptics:true,notif:false,time:'08:00'}};
try{Object.assign(S,JSON.parse(localStorage.getItem(K)||'{}'))}catch{}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch{}};
const buzz=(n=15)=>{S.set.haptics&&navigator.vibrate&&navigator.vibrate(n)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const theme=()=>S.set.theme==='auto'?document.documentElement.removeAttribute('data-theme'):document.documentElement.dataset.theme=S.set.theme;
const key=()=>`${S.week}-${S.day}`,cur=()=>PROGRAM[S.week-1][S.day];
function streak(){const d=new Set(S.hist.map(h=>h.date));let n=0,t=new Date();if(!d.has(today()))t.setDate(t.getDate()-1);while(d.has(t.toISOString().slice(0,10))){n++;t.setDate(t.getDate()-1)}return n}
const chips=a=>a.map(([l,p,act])=>`<button class="chip" aria-pressed="${p}" data-a="${act}">${l}</button>`).join('');
function train(){const d=cur(),w=S.w[key()]||[];
 return `<h1>Training</h1><div class="tabs" role="group" aria-label="Week">${chips([1,2,3,4].map(i=>['Week '+i,S.week===i,'w'+i]))}</div>
 <div class="tabs" role="group" aria-label="Day">${chips(DAYS.map((x,i)=>[x,S.day===i,'d'+i]))}</div>
 <section class="card"><h2 style="margin-top:0">${d.name}, ${DAYS[S.day]} of week ${S.week}</h2>
 ${d.rest?'<p>Rest day. Walk, stretch and sleep well.</p>':`<div class="bodies">${bodySVG('f',d.muscles)}${bodySVG('b',d.muscles)}</div>
 <div class="row">${d.muscles.map(m=>`<button class="chip" data-m="${m}">${MUSCLES[m].n}</button>`).join('')}</div>`}</section>
 ${d.exercises.map((e,i)=>`<div class="card ex"><div class="row"><div class="mini">${icon(e.muscle)}</div><div><strong>${e.name}</strong><div class="mut">${e.sets} × ${e.reps}, ${MUSCLES[e.muscle].n}</div></div></div>
 <label class="mut">kg<input type="number" inputmode="decimal" min="0" data-i="${i}" value="${w[i]||''}" aria-label="Weight for ${esc(e.name)}"></label></div>`).join('')}
 ${d.rest?'':`<button class="btn" data-a="done" style="width:100%">Complete workout</button>`}
 <h2>Muscle library</h2><div class="grid">${Object.entries(MUSCLES).map(([k,m])=>`<button class="card row" data-m="${k}"><span class="mini">${icon(k)}</span>${m.n}</button>`).join('')}</div>`}
function dash(){const h=S.hist,tot=h.reduce((s,x)=>s+x.vol,0),last=h.slice(-7),max=Math.max(1,...last.map(x=>x.vol)),st=streak();
 const B=[['First workout',h.length>=1],['3-day streak',st>=3],['7-day streak',st>=7],['10 workouts',h.length>=10],['5,000 kg lifted',tot>=5000]];
 const a=h.slice(-3).reduce((s,x)=>s+x.vol,0),b=h.slice(-6,-3).reduce((s,x)=>s+x.vol,0);
 const tip=h.length<2?'Log two sessions and your personal insights will appear here.':a>=b?'Volume is trending up. Add 2.5 kg to your top lift next session.':'Volume dipped lately. Keep weights steady and focus on form this week.';
 return `<h1>Dashboard</h1><div class="grid"><div class="card"><div class="big">${st}</div>day streak</div><div class="card"><div class="big">${h.length}</div>workouts done</div><div class="card"><div class="big">${tot.toLocaleString()}</div>kg lifted</div></div>
 <section class="card"><h2 style="margin-top:0">Weight lifted per workout</h2>${last.length?`<svg viewBox="0 0 ${last.length*50} 120" role="img" aria-label="Bar chart of weight lifted">${last.map((x,i)=>`<rect x="${i*50+8}" y="${100-x.vol/max*90}" width="34" height="${x.vol/max*90}" rx="4" fill="var(--ac)"/><text x="${i*50+25}" y="115" text-anchor="middle" font-size="9" fill="currentColor">${x.date.slice(5)}</text>`).join('')}</svg>`:'<p class="mut">No workouts yet. Complete one in Training.</p>'}</section>
 <section class="card"><h2 style="margin-top:0">Insight</h2><p>${tip}</p></section><section class="card"><h2 style="margin-top:0">Badges</h2>${B.map(([n,o])=>`<span class="badge ${o?'on':''}">${o?'✓ ':''}${n}</span>`).join('')}</section>`}
function sett(){const s=S.set;return `<h1>Settings</h1><section class="card"><label>Theme<select data-s="theme">${[['auto','Match device'],['light','Light'],['dark','Dark'],['contrast','High contrast']].map(([v,l])=>`<option value="${v}" ${s.theme===v?'selected':''}>${l}</option>`).join('')}</select></label>
 <p><label><input type="checkbox" data-s="haptics" ${s.haptics?'checked':''}> Haptic feedback</label></p></section>
 <section class="card"><h2 style="margin-top:0">Daily reminder</h2><label>Time<input type="time" data-s="time" value="${s.time}"></label><p class="row"><button class="btn" data-a="notif">${s.notif?'Reminders on':'Enable reminders'}</button><button class="btn ghost" data-a="voice">🎤 Voice logging</button></p></section>
 <section class="card"><h2 style="margin-top:0">Help</h2><p>Pick a week and day in Training. Highlighted muscles show the day's focus; tap any muscle to see it pop. Swipe left or right to change day. Enter kilograms, then tap Complete workout. Voice: say “log 40” to fill the next empty weight, or “complete”.</p><p class="mut">Works offline once loaded. To install and get reminders, open this page in your browser from Messenger and use Add to Home Screen.</p><button class="btn ghost" data-a="reset">Reset all data</button></section>`}
function render(skel){const v=$('#view');document.querySelectorAll('nav button').forEach(b=>b.dataset.t===S.tab?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
 const go=()=>{try{v.innerHTML=`<div class="view">${{train,dash,sett}[S.tab]()}</div>`;if(skel){const h=v.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});$('#st').textContent=h.textContent+' screen'}}catch(e){fail(e)}};
 if(skel){v.innerHTML='<div class="sk"></div><div class="sk"></div><div class="sk"></div>';setTimeout(go,220)}else go();save()}
function fail(e){console.error(e);$('#view').innerHTML=`<div class="card err"><h2>Something went wrong</h2><p>${esc(e.message||'Unknown error')}</p><button class="btn" onclick="location.reload()">Reload app</button></div>`}
addEventListener('error',e=>fail(e.error||e));addEventListener('unhandledrejection',e=>fail(e.reason||{}));
function done(){const d=cur(),w=S.w[key()]||[];S.hist=S.hist.filter(h=>h.key!==key());S.hist.push({key:key(),date:today(),vol:volume(d.exercises,w)});buzz([30,40,30]);S.tab='dash';render(1)}
let pushOK=false;
async function syncPush(){try{if(!S.set.notif||!('PushManager'in window))return;const reg=await navigator.serviceWorker.ready,{key}=await(await fetch('/api/vapid')).json();
 const k=Uint8Array.from(atob(key.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
 const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:k});
 const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sub,time:S.set.time,tz:Intl.DateTimeFormat().resolvedOptions().timeZone})});pushOK=r.ok}catch(e){pushOK=false;console.warn('Server push unavailable; using in-app reminders',e)}}
async function remind(){if(!('Notification'in window))return alert('Notifications are not supported in this browser.');
 S.set.notif=(await Notification.requestPermission())==='granted';save();render();if(!S.set.notif)alert('Permission denied. Enable notifications in browser settings.');else syncPush()}
setInterval(async()=>{if(!S.set.notif||pushOK||Notification.permission!=='granted')return;const t=new Date().toTimeString().slice(0,5);
 if(t===S.set.time&&S.last!==today()){S.last=today();save();const r=await navigator.serviceWorker?.getRegistration(),o={body:`Today: ${cur().name}. Let's go.`,icon:'icons/icon.svg'};r?r.showNotification('FitPulse workout',o):new Notification('FitPulse workout',o)}},30000);
function voice(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert('Voice commands are not supported in this browser.');
 const r=new R();r.onresult=e=>{const t=e.results[0][0].transcript.toLowerCase(),n=t.match(/\d+(\.\d+)?/),d=cur(),w=S.w[key()]=S.w[key()]||[];
  if(/complete|done|finish/.test(t))done();else if(n){const i=d.exercises.findIndex((_,i)=>!w[i]);if(i>=0){w[i]=n[0];S.tab='train';buzz();render()}}};r.start()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-t],[data-a],[data-m]');if(!t)return;buzz();
 if(t.dataset.t){S.tab=t.dataset.t;render(1)}else if(t.dataset.m){document.querySelectorAll(`.m[data-m="${t.dataset.m}"]`).forEach(n=>{n.classList.remove('pop');void n.getBoundingClientRect();n.classList.add('pop')})}
 else{const a=t.dataset.a;if(/^w\d$/.test(a))S.week=+a[1];else if(/^d\d$/.test(a))S.day=+a[1];else if(a==='done')return done();else if(a==='notif')return remind();else if(a==='voice')return voice();
  else if(a==='reset'){if(confirm('Delete all progress?')){localStorage.removeItem(K);location.reload()}return}render()}});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.i!==undefined){(S.w[key()]=S.w[key()]||[])[t.dataset.i]=t.value;save()}else if(t.dataset.s){S.set[t.dataset.s]=t.type==='checkbox'?t.checked:t.value;theme();save();if(t.dataset.s==='time')syncPush()}});
let x0=0;const V=$('#view');V.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
V.addEventListener('touchend',e=>{if(S.tab!=='train'||e.target.closest('input'))return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>60){S.day=(S.day+(dx<0?1:6))%7;buzz(10);render()}});
theme();render(1);addEventListener('load',()=>setTimeout(syncPush,800));
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
