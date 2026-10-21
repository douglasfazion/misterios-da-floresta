import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const files=await readdir(root+'/dist/assets');
const jsFile=files.find(f=>f.endsWith('.js'));
if(!jsFile)throw Error('Build Vite JS ausente');
const js=await readFile(root+'/dist/assets/'+jsFile,'utf8');
const css=await readFile(root+'/public/style.css','utf8');
const vendor=await readFile(root+'/public/vendor/phaser-runtime.js','utf8');
const embedded={};
for(const name of ['bg_waterfall.jpg','stone.png','moss.png','joca-walk.png'])
 embedded[name]='data:image/'+(name.endsWith('.jpg')?'jpeg':'png')+';base64,'+(await readFile(root+'/public/assets/'+name)).toString('base64');
const escape=s=>s.replace(/<\/script/gi,'<\\/script');
let html=await readFile(root+'/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="/style.css">',`<style>${css}</style>`);
html=html.replace(/<script src="\/vendor\/phaser-runtime.js"><\/script><script type="module" src="\/src\/main.ts"><\/script>/,
 `<script>window.__JOCA_ASSETS__=${JSON.stringify(embedded)};</script><script>${escape(vendor)}</script><script type="module">${escape(js)}</script>`);
await writeFile(root+'/JOGAR.html',html);
console.log('JOCA 0.4.3 standalone HTML generated.');
