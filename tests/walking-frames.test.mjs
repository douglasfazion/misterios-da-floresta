import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { FRAME_TEXTURES } from '../runtime/phaser/phaser/manifest.js';
const src='reference/folha-aprovada-original.png';
test('fonte aprovada incluída para rastreabilidade',()=>assert.ok(existsSync(src)));
test('Phaser usa exatamente oito poses da caminhada',()=>{
  assert.deepEqual(FRAME_TEXTURES.filter(x=>x.startsWith('joca_walk_')),
    ['joca_walk_00','joca_walk_01','joca_walk_02','joca_walk_03','joca_walk_04','joca_walk_05','joca_walk_06','joca_walk_07']);
});
test('nenhum arquivo de caminhada com quadros extras ou ausentes',()=>{
 for(let i=0;i<8;i++)assert.ok(existsSync(`assets/joca_walk_0${i}.png`));
});
test('offline usa ciclo de oito sem antiga reordenação',()=>{
 const t=readFileSync('runtime/offline-game.js','utf8');
 assert.match(t,/p\.walkPhase=\(p\.gaitDistance\/32\)%8/);
 assert.ok(!t.includes('walkOrder'));
 assert.match(t,/Math\.floor\(p\.walkPhase\)%8/);
});
