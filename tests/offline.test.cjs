const test=require('node:test');
const assert=require('node:assert/strict');
const {createPlayer,stepPlayer,stopPlayer}=require('../.test-build/player.js');
const {MOVE,WORLD}=require('../.test-build/config.js');
const tick=(state,direction,seconds)=>{
 let p=state;
 for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)p=stepPlayer(p,direction,MOVE.fixedStep);
 return p;
};
test('starts at the configured spawn and an idle-compatible frame',()=>{
 const p=createPlayer();assert.equal(p.x,WORLD.startX);assert.equal(p.phase,1/8);assert.equal(p.velocity,0);
});
test('walks both directions without exceeding the speed cap',()=>{
 for(const direction of [-1,1]){
  const p=tick({...createPlayer(),x:2000},direction,1);
  assert.ok((p.x-2000)*direction>150);
  assert.ok(Math.abs(p.velocity)<=MOVE.speed+0.00001);
  assert.equal(p.facing,direction);
 }
});
test('releases gradually, then becomes fully stationary',()=>{
 const walking=tick(createPlayer(),1,1);
 const braking=tick(walking,0,.1);
 assert.ok(braking.velocity>0&&braking.velocity<walking.velocity);
 const stopped=tick(braking,0,1);
 assert.equal(stopped.velocity,0);
 assert.equal(tick(stopped,0,2).x,stopped.x);
});
test('turns only when physical displacement reverses',()=>{
 const walking=tick(createPlayer(),1,.7);
 const first=stepPlayer(walking,-1,MOVE.fixedStep);
 assert.equal(first.facing,1);
 const reversed=tick(first,-1,.4);
 assert.equal(reversed.facing,-1);
 assert.ok(reversed.velocity<0);
});
test('respects the right world boundary and freezes distance/phase',()=>{
 const at=tick({...createPlayer(),x:WORLD.maxX-5},1,2);
 assert.equal(at.x,WORLD.maxX);assert.equal(at.velocity,0);
 const next=tick(at,1,2);
 assert.equal(next.x,at.x);assert.equal(next.distance,at.distance);
 assert.equal(next.phase,at.phase);
});
test('respects the left world boundary',()=>{
 const at=tick({...createPlayer(),x:WORLD.minX+5},-1,2);
 assert.equal(at.x,WORLD.minX);assert.equal(at.velocity,0);
 assert.ok(tick(at,1,.3).x>at.x);
});
test('phase advances exactly with real distance, including a clamped last step',()=>{
 const p=stepPlayer({...createPlayer(),x:WORLD.maxX-1,velocity:MOVE.speed},1,MOVE.fixedStep);
 assert.equal(p.distance,1);
 assert.ok(Math.abs(p.phase-(1/8+1/MOVE.stride))<1e-9);
});
test('equal fixed steps are deterministic',()=>{
 const a=tick(createPlayer(),1,.5);
 const b=tick(createPlayer(),1,.5);
 assert.deepEqual(a,b);
});
test('blur/visibility stop clears velocity without changing the position',()=>{
 const p=tick(createPlayer(),1,.4);const next=stopPlayer(p);
 assert.equal(next.velocity,0);assert.equal(next.moving,false);assert.equal(next.x,p.x);
});
test('rejects invalid time steps',()=>{
 const p=createPlayer();for(const dt of [-1,0,NaN,Infinity])assert.deepEqual(stepPlayer(p,1,dt),p);
});
test('opposing inputs produce zero target velocity',()=>{
 const p=tick(createPlayer(),1,.5);
 const released=tick(p,0,.5);
 assert.ok(released.velocity<p.velocity);
});
const {resolveGaitPose,SEAM_START}=require('../.test-build/gait.js');
test('loop smoothing is confined to the end of the last pose',()=>{
 for(let i=0;i<7;i++){
  const p=resolveGaitPose((i+.5)/8,true);
  assert.equal(p.frame,i);assert.equal(p.blend,0);
 }
 const seam=resolveGaitPose((SEAM_START+1)/2,true);
 assert.equal(seam.frame,7);assert.equal(seam.nextFrame,0);
 assert.ok(seam.blend>0&&seam.blend<1);
});
test('cyclic 8->1 seam reaches identical presentation on both sides of wrap',()=>{
 const prior=resolveGaitPose(1-1e-8,true);
 const after=resolveGaitPose(0,true);
 assert.equal(prior.nextFrame,0);assert.ok(1-prior.blend<1e-10);
 assert.equal(after.frame,0);assert.equal(after.blend,0);
});
test('blend progresses monotonically and starts/ends with zero derivative',()=>{
 let previous=0;
 for(let i=0;i<100;i++){
  const t=i/100;const p=resolveGaitPose(SEAM_START+(1-SEAM_START)*t,true);
  assert.ok(p.blend>=previous-1e-12);previous=p.blend;
 }
 assert.equal(resolveGaitPose(SEAM_START,true).blend,0);
 assert.ok(resolveGaitPose(SEAM_START+1e-6,true).blend<1e-6);
});
test('standing keeps original idle art with no overlay',()=>{
 for(const phase of [0,.5,.975,1,NaN]){
  const p=resolveGaitPose(phase,false);
  assert.equal(p.frame,1);assert.equal(p.blend,0);
 }
});
