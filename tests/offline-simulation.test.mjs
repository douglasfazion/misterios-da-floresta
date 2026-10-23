import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync('runtime/offline-game.js','utf8');
function setup(){
 const ev={},queue=[];
 const gradient={addColorStop(){}};
 const canvasCtx=new Proxy({createLinearGradient(){return gradient;}},{get(o,k){return o[k]??(()=>{});},set(o,k,v){o[k]=v;return true;}});
 const canvas={width:1280,height:720,getContext(){return canvasCtx}};
 let now=0;
 const scope={console, Math, document:{getElementById(id){return id==='game'?canvas:null;}},
  Image:class {constructor(){this.complete=false;this.naturalWidth=0;}set src(v){this.complete=true;this.naturalWidth=250;this.onload?.();}},
  addEventListener(name,cb){ev[name]=cb;},requestAnimationFrame(cb){queue.push(cb)} };
 scope.window=scope;
 vm.createContext(scope);
 vm.runInContext(code,scope,{timeout:1000});
 function key(code,down){ev[down?'keydown':'keyup']({code,preventDefault(){}})}
 function step(n=1){for(let i=0;i<n;i++){const cb=queue.shift();assert.ok(cb,'loop frame pending');now+=16.667;cb(now)}}
 return {scope,key,step};
}
test('replay offline restaura caminhada, pulo, ataque, sprites e câmera',()=>{
 const t=setup();
 assert.equal(t.scope.__JOCA_READY__,true);
 assert.equal(t.scope.__JOCA_DEBUG__().loaded,44);
 const begin=t.scope.__JOCA_DEBUG__();
 t.key('KeyD',true);t.step(35);
 const walking=t.scope.__JOCA_DEBUG__();
 assert.ok(walking.x>begin.x+30,`${walking.x} should be bigger than ${begin.x}`);
 t.key('Space',true);t.step(6);
 const jumping=t.scope.__JOCA_DEBUG__();
 assert.ok(jumping.y<walking.y-15,`jump y ${jumping.y} < ${walking.y}`);
 t.key('Space',false);t.key('KeyD',false);t.step(48);
 t.key('KeyJ',true);t.step(3);
 const attacking=t.scope.__JOCA_DEBUG__();
 assert.ok(attacking.attack>0,'claw attack active');
 t.key('KeyJ',false);t.step(35);
 t.key('KeyR',true);t.step(2);
 assert.ok(t.scope.__JOCA_DEBUG__().x<=110,'reset returns to start');
});
