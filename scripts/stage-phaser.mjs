import fs from 'node:fs';import path from 'node:path';
const src=path.join('node_modules','phaser','dist','phaser.min.js');
const dest=path.join('vendor','phaser.min.js');
if(fs.existsSync(src)){
 fs.mkdirSync('vendor',{recursive:true});fs.copyFileSync(src,dest);
 console.log('Runtime Phaser copiado localmente para',dest);
}else console.log('Runtime Phaser indisponível neste ambiente: modo offline permanece jogável.');
