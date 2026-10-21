import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const names=['tail','rear_upper_arm','rear_forearm','near_upper_arm','near_forearm','rear_thigh','rear_calf','rear_foot','near_thigh','near_calf','near_foot','torso','cloth'];
const sha=b=>createHash('sha256').update(b).digest('hex');
const original=await readFile(root+'/art-source/v0.3.3-original/joca-walk.png');
assert.equal(original.readUInt32BE(16),1536);
assert.equal(original.readUInt32BE(20),1024);
for(const name of names){
 const src=await readFile(root+'/art-source/v0.3.12-rig/'+name+'.png');
 const playable=await readFile(root+'/public/assets/rig/'+name+'.png');
 assert.equal(sha(playable),sha(src),name+' rig texture unexpectedly changed');
 assert.equal(src.toString('hex',0,8),'89504e470d0a1a0a');
}
console.log(`JOCA v0.3.12: approved v0.3.3 source SHA256 ${sha(original).slice(0,16)}, 13 articulated parts verified`);
