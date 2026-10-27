export const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
export const SPLIT=[{name:'Push',m:['chest','shoulders','triceps']},{name:'Pull',m:['lats','traps','biceps']},{name:'Legs',m:['quads','hamstrings','glutes','calves']},
 {name:'Core & neck',m:['abs','obliques','lowerback','neck']},{name:'Arms',m:['biceps','triceps','forearms']},{name:'Full body',m:['chest','lats','quads','abs']},{name:'Rest',m:[],rest:true}];
export const EX={chest:['Bench press','Incline dumbbell press'],shoulders:['Overhead press','Lateral raise'],triceps:['Dips','Skull crusher'],
 lats:['Pull-up','Barbell row'],traps:['Shrug','Face pull'],biceps:['Barbell curl','Hammer curl'],quads:['Back squat','Leg press'],
 hamstrings:['Romanian deadlift','Leg curl'],glutes:['Hip thrust','Walking lunge'],calves:['Standing calf raise','Seated calf raise'],
 abs:['Cable crunch','Hanging leg raise'],obliques:['Russian twist','Side plank'],lowerback:['Back extension','Good morning'],
 neck:['Neck flexion (light)','Neck extension (light)'],forearms:['Wrist curl','Farmer carry']};
const REPS=[12,10,10,8];
export const PROGRAM=Array.from({length:4},(_,w)=>SPLIT.map((d,i)=>({week:w+1,day:i,name:d.name,muscles:d.m,rest:!!d.rest,
 exercises:d.m.flatMap(m=>EX[m].slice(0,d.m.length>3?1:2).map(n=>({name:n,muscle:m,sets:w>1?4:3,reps:REPS[w]})))})));
export const volume=(ex,w)=>ex.reduce((s,e,i)=>s+(+w[i]||0)*e.sets*e.reps,0);
