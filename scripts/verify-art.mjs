import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const source=await readFile(root+'/art-source/v0.4.4-eight-frame/source-8poses.png');
const packed=await readFile(root+'/public/assets/joca-walk.png');
const manifest=JSON.parse(await readFile(root+'/art-source/v0.4.4-eight-frame/registration.json','utf8'));
const png=(b)=>{assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');return [b.readUInt32BE(16),b.readUInt32BE(20)];};
const sha=b=>createHash('sha256').update(b).digest('hex');
assert.deepEqual(png(source),[1774,887],'Source image dimensions changed');
assert.deepEqual(png(packed),[2240,1120],'Packed sheet must be four-by-two 560-pixel cells');
assert.equal(manifest.frames.length,8,'Exactly 8 poses required');
assert.equal(manifest.columns,4);assert.equal(manifest.rows,2);
for(const [i,f] of manifest.frames.entries()){
 assert.equal(f.index,i,'Frame order changed');
 assert.equal(f.ground_contact_y,530,`Support line must remain fixed in frame ${i}`);
 assert.ok(f.head_top_y>=95&&f.head_top_y<=122,`Head position shifted unexpectedly in frame ${i}`);
}
console.log(`JOCA v0.4.4 art OK: original 4×2 source (${sha(source).slice(0,12)}…), 8 poses, ground line=530, packed (${sha(packed).slice(0,12)}…)`);
