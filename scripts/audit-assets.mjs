import fs from 'node:fs';import assert from 'node:assert/strict';
const names=[];
for(const [name,count] of [['joca_walk',8],['joca_run',6],['joca_jump',6],['joca_strike',12]])for(let i=0;i<count;i++)names.push(`${name}_${String(i).padStart(2,'0')}.png`);
for(const name of ['stone.png','moss.png','bg_forest.jpg','bg_ruins.jpg','bg_waterfall.jpg','distant_forest.jpg'])names.push(name);
for(const name of names){const path='assets/'+name;assert.ok(fs.existsSync(path),path);assert.ok(fs.statSync(path).size>500,`${path} vazio`);}
console.log('Auditoria OK:',names.length,'imagens presentes.');
