import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir,rm,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const dist=root+'/dist';
await rm(dist,{recursive:true,force:true});
await mkdir(dist+'/vendor',{recursive:true});await mkdir(dist+'/assets',{recursive:true});
execFileSync('tsc',['-p','tsconfig.offline.json'],{cwd:root,stdio:'inherit'});
const assetNames=['bg_waterfall.jpg','stone.png','moss.png','joca-walk.png'];
for(const name of assetNames)await copyFile(root+'/public/assets/'+name,dist+'/assets/'+name);
const vendor=await readFile(root+'/public/vendor/phaser-runtime.js','utf8');
const loader=await readFile(root+'/scripts/amd-loader.js','utf8');
const app=await readFile(dist+'/app.js','utf8');
const css=await readFile(root+'/public/style.css','utf8');
await writeFile(dist+'/vendor/phaser-runtime.js',vendor);
await writeFile(dist+'/amd-loader.js',loader);
await writeFile(dist+'/style.css',css);
const source=await readFile(root+'/index.html','utf8');
const clean=source.replace(/<link rel="stylesheet" href="\/style.css">/,'<link rel="stylesheet" href="style.css">')
 .replace(/<script src="\/vendor\/phaser-runtime.js"><\/script><script type="module" src="\/src\/main.ts"><\/script>/,
 '<script src="vendor/phaser-runtime.js"></script><script src="amd-loader.js"></script><script src="app.js"></script>');
await writeFile(dist+'/index.html',clean);
const embedded={};
for(const name of assetNames)embedded[name]='data:image/'+(name.endsWith('.jpg')?'jpeg':'png')+';base64,'+
 (await readFile(dist+'/assets/'+name)).toString('base64');
const embed=v=>v.replace(/<\/script/gi,'<\\/script');
const standalone=source.replace('<link rel="stylesheet" href="/style.css">',`<style>${css}</style>`)
 .replace(/<script src="\/vendor\/phaser-runtime.js"><\/script><script type="module" src="\/src\/main.ts"><\/script>/,
 `<script>window.__JOCA_ASSETS__=${JSON.stringify(embedded)};</script>`+
 `<script>${embed(vendor)}</script>`+`<script>${embed(loader)}</script>`+`<script>${embed(app)}</script>`);
await writeFile(root+'/JOGAR.html',standalone);
console.log('JOCA v0.4.6 offline build: dist/ and standalone JOGAR.html generated');
