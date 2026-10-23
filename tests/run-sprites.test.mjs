import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';

function alphaFromPNG(path) {
  const bytes=fs.readFileSync(path);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`PNG válido: ${path}`);
  let ptr=8, width=0, height=0,depth=0,color=0;
  const parts=[];
  while(ptr<bytes.length){
    const len=bytes.readUInt32BE(ptr),type=bytes.toString('ascii',ptr+4,ptr+8);
    const body=bytes.subarray(ptr+8,ptr+8+len);
    if(type==='IHDR') {width=body.readUInt32BE(0);height=body.readUInt32BE(4);depth=body[8];color=body[9];}
    if(type==='IDAT')parts.push(body);
    ptr+=12+len;
    if(type==='IEND')break;
  }
  assert.equal(depth,8);
  assert.equal(color,6,'8-bit RGBA obrigatório');
  const raw=zlib.inflateSync(Buffer.concat(parts));
  const stride=width*4,alpha=new Uint8Array(width*height);
  let prev=Buffer.alloc(stride);
  let off=0;
  for(let y=0;y<height;y++) {
    const filter=raw[off++],cur=Buffer.from(raw.subarray(off,off+stride));off+=stride;
    for(let x=0;x<stride;x++) {
      const left=x>=4?cur[x-4]:0,up=prev[x],upperLeft=x>=4?prev[x-4]:0;
      if(filter===1)cur[x]=(cur[x]+left)&255;
      else if(filter===2)cur[x]=(cur[x]+up)&255;
      else if(filter===3)cur[x]=(cur[x]+Math.floor((left+up)/2))&255;
      else if(filter===4){const p=left+up-upperLeft;const a=Math.abs(p-left),b=Math.abs(p-up),c=Math.abs(p-upperLeft);cur[x]=(cur[x]+(a<=b&&a<=c?left:b<=c?up:upperLeft))&255;}
      else assert.equal(filter,0);
    }
    for(let x=0;x<width;x++)alpha[y*width+x]=cur[x*4+3];
    prev=cur;
  }
  return {width,height,alpha};
}

function connectedSizes(image){
  const {width,height,alpha}=image,seen=new Uint8Array(alpha.length),q=new Int32Array(alpha.length),sizes=[];
  for(let at=0;at<alpha.length;at++){
    if(seen[at]||alpha[at]<=8)continue;
    let top=0,end=1,count=0;q[0]=at;seen[at]=1;
    while(top<end){
      const i=q[top++];count++;
      const x=i%width,y=Math.floor(i/width);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        if(dx===0&&dy===0)continue;
        const nx=x+dx,ny=y+dy;
        if(nx<0||nx>=width||ny<0||ny>=height)continue;
        const v=ny*width+nx;
        if(!seen[v]&&alpha[v]>8){seen[v]=1;q[end++]=v;}
      }
    }
    if(count>40)sizes.push(count);
  }
  return sizes.sort((a,b)=>b-a);
}

test('sprites da corrida não contêm elementos de poses vizinhas ou laterais cortadas',()=>{
  for(let i=0;i<8;i++){
    const path=`assets/joca_run_${String(i).padStart(2,'0')}.png`;
    const im=alphaFromPNG(path);
    assert.equal(im.width,600,`largura: ${path}`);
    assert.equal(im.height,540,`altura: ${path}`);
    const sizes=connectedSizes(im);
    assert.ok(sizes.length===1 || (sizes.length===2 && sizes[1]<5000),`fragmentos desconectados em ${path}: ${sizes}`);
    assert.ok(sizes[0]>65000,`personagem completo em ${path}`);
    let left=0,right=0;
    for(let y=0;y<im.height;y++){
      for(let x=0;x<3;x++)if(im.alpha[y*im.width+x]>8)left++;
      for(let x=im.width-2;x<im.width;x++)if(im.alpha[y*im.width+x]>8)right++;
    }
    assert.equal(left,0,`fragmento encostado na borda esquerda: ${path}`);
    assert.equal(right,0,`sprite cortado na borda direita: ${path}`);
  }
});


test('manifesto e runtime usam corrida com 8 quadros',()=>{
  const manifest=fs.readFileSync('src/phaser/manifest.ts','utf8');
  assert.match(manifest,/length:8/);
  const offline=fs.readFileSync('runtime/offline-game.js','utf8');
  assert.match(offline,/%8/);
});
