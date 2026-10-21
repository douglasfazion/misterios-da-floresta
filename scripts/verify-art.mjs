import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const source=await readFile(root+'/art-source/v0.3.13-walk/walk-input.png');
const shipped=await readFile(root+'/public/assets/joca-walk.png');
const sha=b=>createHash('sha256').update(b).digest('hex');
const png=(b)=>{assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');return [b.readUInt32BE(16),b.readUInt32BE(20)];};
assert.deepEqual(png(source),[1448,1086],'12-frame source grid changed');
assert.deepEqual(png(shipped),[1792,1260],'4×3 packed spritesheet dimensions incorrect');
const manifest=JSON.parse(await readFile(root+'/art-source/v0.3.13-walk/registration.json','utf8'));
assert.equal(manifest.frames.length,12);
for(const [i,f] of manifest.frames.entries()){
 assert.equal(f.frame,i);
 assert.equal(f.contact_bottom_y,390,'Inconsistent contact line frame '+i);
 assert.ok(f.head_top_y>=35&&f.head_top_y<=45,'Torso/head anchor changed frame '+i);
}
console.log(`JOCA v0.3.13 art verified: 12 frames, aligned foot contact, source ${sha(source).slice(0,12)}…, packaged ${sha(shipped).slice(0,12)}…`);
