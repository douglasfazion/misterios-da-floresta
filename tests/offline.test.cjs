const test=require('node:test');
const assert=require('node:assert/strict');
const {createPlayer,stepPlayer,stopPlayer}=require('../.test-build/player.js');
const {MOVE,WORLD,ART}=require('../.test-build/config.js');
const {frameForPhase}=require('../.test-build/gait.js');
const tick=(start,dir,seconds)=>{
 let state=start;
 for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)state=stepPlayer(state,dir,MOVE.fixedStep);
 return state;
};
test('approved locomotion constants and spawn remain unchanged',()=>{
 assert.equal(WORLD.startX,180);assert.equal(MOVE.speed,210);
 assert.equal(MOVE.stride,168);assert.equal(MOVE.fixedStep,1/120);
 assert.equal(createPlayer().velocity,0);
});
test('walking left/right moves within original speed cap',()=>{
 for(const dir of [-1,1]){
  const p=tick({...createPlayer(),x:2000},dir,1);
  assert.ok((p.x-2000)*dir>150);
  assert.ok(Math.abs(p.velocity)<=MOVE.speed+1e-8);
  assert.equal(p.facing,dir);
 }
});
test('release decelerates and reaches full stop',()=>{
 const p=tick(createPlayer(),1,.7);
 const braking=tick(p,0,.1);
 assert.ok(braking.velocity>0&&braking.velocity<p.velocity);
 const stopped=tick(braking,0,1);
 assert.equal(stopped.velocity,0);
 assert.equal(tick(stopped,0,1).x,stopped.x);
});
test('direction reversal follows actual physical displacement',()=>{
 const p=tick(createPlayer(),1,1);
 assert.equal(stepPlayer(p,-1,MOVE.fixedStep).facing,1);
 assert.equal(tick(p,-1,.4).facing,-1);
});
test('level bounds block movement and preserve phase',()=>{
 const at=tick({...createPlayer(),x:WORLD.maxX-5},1,2);
 assert.equal(at.x,WORLD.maxX);
 const again=tick(at,1,.5);
 assert.equal(again.distance,at.distance);assert.equal(again.phase,at.phase);
 const left=tick({...createPlayer(),x:WORLD.minX+5},-1,2);
 assert.equal(left.x,WORLD.minX);
});
test('focus loss stops immediately without moving player',()=>{
 const p=tick(createPlayer(),1,.4);
 const stopped=stopPlayer(p);
 assert.equal(stopped.x,p.x);assert.equal(stopped.velocity,0);assert.equal(stopped.moving,false);
});
test('determinism and invalid time guards remain intact',()=>{
 const p=createPlayer();assert.deepEqual(tick(p,1,.5),tick(p,1,.5));
 for(const dt of [0,-1,NaN,Infinity])assert.deepEqual(stepPlayer(p,1,dt),p);
});
test('approved 12-frame layout is used at every discrete phase',()=>{
 assert.equal(ART.frames,12);assert.equal(ART.frameWidth,448);assert.equal(ART.frameHeight,420);
 for(let i=0;i<12;i++)assert.equal(frameForPhase((i+.5)/12,true),i);
});
test('loop 11→0 wraps cyclically with no duplicate pause',()=>{
 assert.equal(frameForPhase(1-1e-9,true),11);
 assert.equal(frameForPhase(1,true),0);
 assert.equal(frameForPhase(0,true),0);
 assert.equal(frameForPhase(2+1/12,true),1);
});
test('standing uses same fixed reference pose without joint animation',()=>{
 for(const phase of [0,.2,.8,1,NaN,Infinity])assert.equal(frameForPhase(phase,false),ART.idleFrame);
});
test('walk phase continues to be proportional to actual distance',()=>{
 const p=stepPlayer({...createPlayer(),x:WORLD.maxX-1,velocity:MOVE.speed},1,MOVE.fixedStep);
 assert.equal(p.distance,1);
 assert.ok(Math.abs(p.phase-(1/8+1/MOVE.stride))<1e-9);
});
