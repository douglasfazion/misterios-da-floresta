import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const source=await readFile(root+'/art-source/v0.4.0-four-frame/source-4poses.png');
const packed=await readFile(root+'/public/assets/joca-walk.png');
const manifest=JSON.parse(await readFile(root+'/art-source/v0.4.0-four-frame/registration.json','utf8'));
const png=(b)=>{assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');return [b.readUInt32BE(16),b.readUInt32BE(20)];};
const sha=b=>createHash('sha256').update(b).digest('hex');
assert.deepEqual(png(source),[1227,1282],'Source image dimensions changed');
assert.deepEqual(png(packed),[1400,1400],'Packed sheet must be two-by-two 700-pixel cells');
assert.equal(manifest.frames.length,4,'Exactly 4 poses required');
assert.equal(manifest.columns,2);assert.equal(manifest.rows,2);
for(const [i,f] of manifest.frames.entries()){
 assert.equal(f.index,i,'Frame order changed');
 assert.equal(f.ground_contact_y,675,`Support line must remain fixed in frame ${i}`);
 assert.ok(f.head_top_y>=50&&f.head_top_y<=75,`Head position shifted unexpectedly in frame ${i}`);
}
console.log(`JOCA v0.4.0 art OK: original 2×2 source (${sha(source).slice(0,12)}…), 4 poses, ground line=675, packed (${sha(packed).slice(0,12)}…)`);
