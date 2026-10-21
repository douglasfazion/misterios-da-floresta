const test=require('node:test');
const assert=require('node:assert/strict');
const {createPlayer,stepPlayer,stopPlayer}=require('../.test-build/player.js');
const {MOVE,WORLD}=require('../.test-build/config.js');
const {resolveRig,JOINTS}=require('../.test-build/rig.js');
const tick=(state,dir,seconds)=>{
 let p=state;
 for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)p=stepPlayer(p,dir,MOVE.fixedStep);
 return p;
};
function close(a,b,tol=1e-4){assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);}
test('spawn and walking move exactly as last playable',()=>{
 const p=createPlayer();assert.equal(p.x,WORLD.startX);assert.equal(p.velocity,0);
 for(const dir of [-1,1]){
  const q=tick({...p,x:2000},dir,1);
  assert.ok((q.x-2000)*dir>150);
  assert.ok(Math.abs(q.velocity)<=MOVE.speed+.00001);
  assert.equal(q.facing,dir);
 }
});
test('stopping, reversing, blur and world bounds keep approved physics',()=>{
 const p=tick(createPlayer(),1,1);
 const braking=tick(p,0,.1);
 assert.ok(braking.velocity>0&&braking.velocity<p.velocity);
 assert.equal(tick(braking,0,1).velocity,0);
 assert.equal(stepPlayer(p,-1,MOVE.fixedStep).facing,1);
 assert.equal(tick(p,-1,.5).facing,-1);
 const halted=stopPlayer(p);assert.equal(halted.velocity,0);assert.equal(halted.x,p.x);
 const wall=tick({...p,x:WORLD.maxX-2},1,1);
 assert.equal(wall.x,WORLD.maxX);assert.equal(wall.velocity,0);
});
test('fixed timestep is deterministic; invalid dt ignored',()=>{
 const p=createPlayer();assert.deepEqual(tick(p,1,.5),tick(p,1,.5));
 for(const dt of [NaN,Infinity,0,-1])assert.deepEqual(stepPlayer(p,1,dt),p);
});
test('both legs take a real stride and bend at both knees',()=>{
 const ankleXNear=new Set(),ankleXRear=new Set(),kneeXNear=new Set(),kneeXRear=new Set();
 for(let i=0;i<96;i++){
  const q=resolveRig(i/96,MOVE.speed);
  ankleXNear.add(q.nearLeg.ankle.x.toFixed(2));ankleXRear.add(q.rearLeg.ankle.x.toFixed(2));
  kneeXNear.add(q.nearLeg.knee.x.toFixed(2));kneeXRear.add(q.rearLeg.knee.x.toFixed(2));
 }
 for(const set of [ankleXNear,ankleXRear,kneeXNear,kneeXRear])assert.ok(set.size>16);
});
test('both arms swing in opposite directions with active elbow motion',()=>{
 const p1=resolveRig(.25,MOVE.speed),p2=resolveRig(.75,MOVE.speed);
 assert.ok(Math.abs(p1.nearArm.wrist.x-p2.nearArm.wrist.x)>35);
 assert.ok(Math.abs(p1.rearArm.wrist.x-p2.rearArm.wrist.x)>35);
 assert.ok(Math.abs(p1.nearArm.upperAngle-p2.nearArm.upperAngle)>.65);
 assert.ok(Math.abs(p1.rearArm.upperAngle-p2.rearArm.upperAngle)>.65);
 assert.ok(Math.abs(p1.nearArm.lowerAngle-p2.nearArm.lowerAngle)>.65);
});
test('planted feet have fixed y; only swinging foot rises',()=>{
 for(let i=1;i<64;i++){
  const q=resolveRig(i/64,MOVE.speed),s=Math.sin(2*Math.PI*i/64);
  if(s>1e-8){close(q.nearLeg.ankle.y,JOINTS.nearLeg.ankle.y);assert.ok(q.rearLeg.ankle.y<JOINTS.rearLeg.ankle.y);}
  else if(s< -1e-8){close(q.rearLeg.ankle.y,JOINTS.rearLeg.ankle.y);assert.ok(q.nearLeg.ankle.y<JOINTS.nearLeg.ankle.y);}
 }
});
test('rig is cyclically continuous at end of gait (including elbows and feet)',()=>{
 const a=resolveRig(1-1e-7,MOVE.speed),b=resolveRig(0,MOVE.speed);
 for(const pair of [[a.nearLeg.ankle,b.nearLeg.ankle],[a.rearLeg.ankle,b.rearLeg.ankle],[a.nearLeg.knee,b.nearLeg.knee],[a.rearLeg.knee,b.rearLeg.knee],
                   [a.nearArm.wrist,b.nearArm.wrist],[a.rearArm.wrist,b.rearArm.wrist]]){
  close(pair[0].x,pair[1].x,.01);close(pair[0].y,pair[1].y,.01);
 }
});
test('rig settles back to original joint reference when stopped',()=>{
 for(const phase of [0,.13,.5,.83,1]){
  const q=resolveRig(phase,0);
  close(q.nearLeg.ankle.x,JOINTS.nearLeg.ankle.x);
  close(q.rearLeg.ankle.x,JOINTS.rearLeg.ankle.x);
  close(q.nearArm.wrist.x,JOINTS.nearArm.wrist.x);
  close(q.rearArm.wrist.x,JOINTS.rearArm.wrist.x);
 }
});
test('IK lengths of foreleg segments preserve joint geometry',()=>{
 const q=resolveRig(.35,MOVE.speed);
 for(const k of ['nearLeg','rearLeg']){
  const ref=JOINTS[k],pose=q[k];
  const hyp=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  close(hyp(ref.hip,ref.knee),hyp(pose.upper,pose.knee),.01);
  close(hyp(ref.knee,ref.ankle),hyp(pose.knee,pose.ankle),.01);
 }
});
