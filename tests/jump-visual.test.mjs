import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

test('salto mantém dimensões visuais consistentes no modo offline',()=>{
 const source=fs.readFileSync('runtime/offline-game.js','utf8');
 assert.match(source,/kind==='jump'\)\{w=176;h=184;y=feet-h;/);
});
test('Phaser e offline utilizam o mesmo tamanho de sprite para salto',()=>{
 const ts=fs.readFileSync('src/phaser/ForestScene.ts','utf8');
 assert.match(ts,/width=176;height=184/);
});
test('todos os quadros de salto estão presentes',()=>{
 for(let i=0;i<8;i++)assert.ok(fs.statSync(`assets/joca_jump_${String(i).padStart(2,'0')}.png`).size>2000);
});
