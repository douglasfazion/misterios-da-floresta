const test=require('node:test');
const assert=require('node:assert/strict');
const {createPlayer,stepPlayer,stopPlayer}=require('../.test-build/player.js');
const {MOVE,WORLD,ART,VERSION,FRAME_ORDER}=require('../.test-build/config.js');
const {frameForPhase}=require('../.test-build/gait.js');
function advance(start,dir,seconds){let s=start;for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)s=stepPlayer(s,dir,MOVE.fixedStep);return s;}
test('new base is versioned as JOCA v0.4.6 and uses eight full sprites',()=>{
 assert.equal(VERSION,'0.4.6');assert.equal(ART.frames,8);assert.equal(ART.frameWidth,560);assert.equal(ART.frameHeight,560);
 assert.equal(ART.anchorX,280);assert.equal(ART.footY,530);
 assert.deepEqual(FRAME_ORDER,[0,4,1,5,2,6,3,7]);
});
test('starts on frame 0 at the previous spawn location',()=>{
 assert.equal(WORLD.startX,180);assert.equal(createPlayer().phase,0);assert.equal(frameForPhase(0,false),0);
});
test('all eight poses appear in corrected playback order',()=>{
 for(let i=0;i<8;i++)assert.equal(frameForPhase((i+.5)/8,true),FRAME_ORDER[i]);
});
test('cycle wraps cleanly without adding a repeated seam frame',()=>{
 assert.equal(frameForPhase(1-1e-9,true),7);assert.equal(frameForPhase(1,true),0);assert.equal(frameForPhase(2,true),0);
});
test('idle never plays the walk',()=>{
 for(const p of [0,.1,.5,.9,1,NaN,Infinity])assert.equal(frameForPhase(p,false),0);
});
test('walk goes left and right within original 210 pixel/s speed cap',()=>{
 for(const dir of [-1,1]){
  const p=advance({...createPlayer(),x:2000},dir,1);
  assert.ok((p.x-2000)*dir>150);assert.ok(Math.abs(p.velocity)<=210+1e-7);assert.equal(p.facing,dir);
 }
});
test('release eases out and eventually stops completely',()=>{
 const moving=advance(createPlayer(),1,.8);const braking=advance(moving,0,.1);
 assert.ok(braking.velocity>0&&braking.velocity<moving.velocity);
 const stopped=advance(braking,0,.9);assert.equal(stopped.velocity,0);assert.equal(advance(stopped,0,.5).x,stopped.x);
});
test('movement direction is based on real displacement, not requested input',()=>{
 const s=advance(createPlayer(),1,.8);assert.equal(stepPlayer(s,-1,MOVE.fixedStep).facing,1);assert.equal(advance(s,-1,.4).facing,-1);
});
test('world boundaries stop movement and do not advance the animation phase',()=>{
 for(const dir of [-1,1]){
  const start={...createPlayer(),x:dir>0?WORLD.maxX-4:WORLD.minX+4};
  const p=advance(start,dir,.8),blocked=advance(p,dir,.8);
  assert.equal(p.x,dir>0?WORLD.maxX:WORLD.minX);assert.equal(blocked.phase,p.phase);assert.equal(blocked.distance,p.distance);
 }
});
test('walking phase follows travelled distance',()=>{
 const p=stepPlayer({...createPlayer(),x:WORLD.maxX-1,velocity:MOVE.speed},1,MOVE.fixedStep);
 assert.equal(p.distance,1);assert.ok(Math.abs(p.phase-1/MOVE.stride)<1e-9);
});
test('focus loss cancels movement safely',()=>{
 const p=advance(createPlayer(),1,.4),s=stopPlayer(p);assert.equal(s.x,p.x);assert.equal(s.velocity,0);assert.equal(s.moving,false);
});
test('fixed-step simulation stays deterministic and rejects invalid time deltas',()=>{
 const p=createPlayer();assert.deepEqual(advance(p,1,.5),advance(p,1,.5));for(const dt of [0,-1,NaN,Infinity])assert.deepEqual(stepPlayer(p,1,dt),p);
});
