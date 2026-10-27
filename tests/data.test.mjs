import test from 'node:test';import assert from 'node:assert';import {PROGRAM,EX} from '../src/data.js';import {MUSCLES,bodySVG} from '../src/muscles.js';
test('4 weeks x 7 days',()=>{assert.equal(PROGRAM.length,4);PROGRAM.forEach(w=>assert.equal(w.length,7))});
test('every muscle has exercises and a shape',()=>Object.keys(EX).forEach(k=>{assert.ok(MUSCLES[k]?.s);assert.ok(EX[k].length>=2)}));
test('svg renders highlight',()=>assert.match(bodySVG('f',['chest']),/class="m on"/));
