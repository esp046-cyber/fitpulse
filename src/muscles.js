const E=(cx,cy,rx,ry,r=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${cx} ${cy})"/>`;
export const MUSCLES={
 neck:{n:'Neck',v:'f',c:1,s:E(50,36,5.5,5)},
 chest:{n:'Chest',v:'f',s:'<path d="M51 50Q64 45 73 55Q70 67 51 66Z"/>'},
 shoulders:{n:'Shoulders',v:'f',s:E(77,53,7,8)},
 biceps:{n:'Biceps',v:'f',s:E(82,71,4.6,10,-14)},
 forearms:{n:'Forearms',v:'f',s:E(87,96,4,12,-12)},
 abs:{n:'Abs',v:'f',c:1,s:'<rect x="43" y="68" width="14" height="29" rx="5"/>'},
 obliques:{n:'Obliques',v:'f',s:'<path d="M59 70L68 73L66 99L59 96Z"/>'},
 quads:{n:'Quads',v:'f',s:E(59,136,9,22)},
 traps:{n:'Traps',v:'b',c:1,s:'<path d="M50 41L65 51L50 70L35 51Z"/>'},
 lats:{n:'Lats',v:'b',s:'<path d="M52 68Q71 57 70 74L62 99L52 95Z"/>'},
 triceps:{n:'Triceps',v:'b',s:E(82,71,4.6,10,-14)},
 lowerback:{n:'Lower back',v:'b',c:1,s:'<rect x="42" y="97" width="16" height="13" rx="4"/>'},
 glutes:{n:'Glutes',v:'b',s:E(58,119,9,9)},
 hamstrings:{n:'Hamstrings',v:'b',s:E(59,147,8.5,18)},
 calves:{n:'Calves',v:'b',s:E(60,181,6,14)}
};
const body=`<circle cx="50" cy="22" r="10"/><path d="M33 47Q50 40 67 47L65 101Q50 110 35 101Z"/><g stroke-linecap="round" fill="none" stroke-width="12"><path d="M74 52L89 100"/><path d="M26 52L11 100"/><path stroke-width="19" d="M58 108L60 192"/><path stroke-width="19" d="M42 108L40 192"/></g>`;
const COL={neck:'#d96ab0',chest:'#e8453c',shoulders:'#f08a24',biceps:'#f2c230',forearms:'#1fb58f',abs:'#29a3e0',obliques:'#5b6cf0',quads:'#a35be8',traps:'#e0574a',lats:'#2f80ed',triceps:'#8bc34a',lowerback:'#ff7aa2',glutes:'#ef6c3a',hamstrings:'#16a69a',calves:'#c850c0'};
const mix=(h,t,a)=>{const n=parseInt(h.slice(1),16);return '#'+[n>>16,n>>8&255,n&255].map(v=>Math.round(v+((t?255:0)-v)*a).toString(16).padStart(2,'0')).join('')};
export function bodySVG(view,active=[]){
 const a=new Set(active),i='g'+Math.random().toString(36).slice(2,6),u=n=>`url(#${i}${n})`,E2=Object.entries(MUSCLES).filter(([k,m])=>m.v===view);
 const grads=E2.map(([k])=>`<radialGradient id="${i}${k}" cx="35%" cy="25%" r="85%"><stop offset="0" stop-color="${mix(COL[k],1,.6)}"/><stop offset=".45" stop-color="${COL[k]}"/><stop offset="1" stop-color="${mix(COL[k],0,.6)}"/></radialGradient>`).join('');
 const shapes=E2.map(([k,m])=>{const on=a.has(k),g=(t='')=>`<g class="m${on?' on':''}" data-m="${k}" fill="${u(k)}" opacity="${on?1:.7}" stroke="${on?'#fff':'#0007'}" stroke-width="${on?.9:.5}" filter="${u('L')}"${t}>${m.s}<g fill="${u('f')}" stroke="none" opacity="${on?.5:.3}">${m.s}</g></g>`;
  return m.c?g():g()+g(' transform="translate(100 0) scale(-1 1)"');}).join('');
 const names=E2.filter(([k])=>a.has(k)).map(([k,m])=>m.n).join(', ');
 return `<svg class="body" viewBox="0 0 100 205" role="img" aria-label="${view==='f'?'Front':'Back'} view${names?', highlighted: '+names:''}"><defs>${grads}
 <linearGradient id="${i}b" x1="0" x2="1"><stop offset="0" stop-color="#141a26"/><stop offset=".5" stop-color="#3b475c"/><stop offset="1" stop-color="#141a26"/></linearGradient>
 <pattern id="${i}f" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(62)"><rect width=".7" height="2.2" fill="#000"/></pattern>
 <filter id="${i}L" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.3" result="b"/>
  <feSpecularLighting in="b" surfaceScale="4" specularConstant=".9" specularExponent="22" lighting-color="#fff" result="s"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".85" k4="0"/></filter></defs>
 <g fill="${u('b')}" stroke="${u('b')}" filter="${u('L')}">${body}</g>${shapes}</svg>`;
}
export const icon=k=>bodySVG(MUSCLES[k].v,[k]);
