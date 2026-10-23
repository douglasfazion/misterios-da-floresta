import test from 'node:test';
import assert from 'node:assert/strict';
import { VIEW, PLATFORMS } from '../runtime/phaser/core/constants.js';
import { platformBelow } from '../runtime/phaser/core/level.js';
import { readFileSync } from 'node:fs';

const isFloor=(p)=>p.y===VIEW.ground && p.h>=200;
const floor=PLATFORMS.filter(isFloor);
const elevated=PLATFORMS.filter(p=>!isFloor(p));

test('chão cobre 100% da largura do mundo sem lacunas',()=>{
 assert.equal(floor.length,1);
 assert.deepEqual({x:floor[0].x,y:floor[0].y,w:floor[0].w}, {x:0,y:VIEW.ground,w:VIEW.worldWidth});
 for(const x of [0,749,810,869,1719,1780,1850,2709,2800,3700,3775,5599]){
   assert.equal(platformBelow(x,VIEW.ground-86),VIEW.ground,`chão ausente na posição ${x}`);
 }
});

test('plataformas elevadas mantidas nas posições originais',()=>{
 assert.equal(elevated.length,11);
 assert.deepEqual(elevated.map(p=>[p.x,p.y,p.w,p.h]),[
  [440,440,190,34],[710,361,180,34],[1080,448,245,34],[1450,390,180,34],
  [1800,440,178,34],[2180,383,210,34],[2570,453,240,34],[3010,402,180,34],
  [3330,323,215,34],[3650,434,260,34],[4190,392,210,34]
 ]);
});

test('chão contínuo e ciclo de corrida com oito quadros também no modo offline',()=>{
 const text=readFileSync('runtime/offline-game.js','utf8');
 assert.match(text,/\{x:0,y:G,w:world,h:250\}/);
 assert.match(text,/p\.runPhase=\(p\.gaitDistance\/30\)%8/);
 assert.match(text,/Math\.floor\(p\.runPhase\)%8/);
});

test('Phaser compila corrida de oito quadros com sprite existente',async()=>{
 const {frameForGround}=await import('../runtime/phaser/core/movement.js');
 assert.deepEqual([0,1,2,3,4,5,6,7,8,9].map(f=>frameForGround(f*30,true)),[0,1,2,3,4,5,6,7,0,1]);
});
