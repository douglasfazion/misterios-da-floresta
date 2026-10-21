import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const target=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!target.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403);res.end();return;}
 const body=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
 }catch{res.writeHead(404);res.end('Arquivo nao encontrado');}});
server.on('error',e=>{console.error('Nao foi possivel iniciar o servidor:',e.message);process.exitCode=1;});
server.listen(8000,'127.0.0.1',()=>console.log('JOCA v0.4.4: abra http://127.0.0.1:8000\nMantenha esta janela aberta. Ctrl+C encerra.'));
