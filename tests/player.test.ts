import {describe,it,expect} from 'vitest';
import {MOVE,WORLD} from '../src/config';
import {createPlayer,stepPlayer,stopPlayer,type PlayerState,type Direction} from '../src/player';
import {JOINTS,resolveRig} from '../src/rig';
function advance(initial:PlayerState,dir:Direction,seconds:number){
 let p=initial;for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)p=stepPlayer(p,dir,MOVE.fixedStep);return p;
}
describe('Movement regression — JOCA 0.3.12',()=>{
 it('starts in a safe idle',()=>expect(createPlayer()).toMatchObject({x:WORLD.startX,velocity:0,moving:false}));
 it('walks both directions without changing the approved cap',()=>{
  for(const dir of [-1,1] as Direction[]){const p=advance({...createPlayer(),x:2000},dir,1);expect(Math.abs(p.velocity)).toBeLessThanOrEqual(MOVE.speed);expect((p.x-2000)*dir).toBeGreaterThan(150);}
 });
 it('decelerates to rest without drift',()=>{const p=advance(createPlayer(),1,.8);const stopped=advance(p,0,1);expect(stopped.velocity).toBe(0);expect(advance(stopped,0,.5).x).toBe(stopped.x);});
 it('stops on focus loss and respects walls',()=>{
  const p=advance(createPlayer(),1,1);expect(stopPlayer(p).velocity).toBe(0);
  expect(advance({...p,x:WORLD.maxX-5},1,1).x).toBe(WORLD.maxX);
 });
});
describe('Articulated 2D gait — JOCA 0.3.12',()=>{
 it('both wrists move and counter-swing',()=>{
  const a=resolveRig(.25,MOVE.speed),b=resolveRig(.75,MOVE.speed);
  expect(Math.abs(a.nearArm.wrist.x-b.nearArm.wrist.x)).toBeGreaterThan(35);
  expect(Math.abs(a.rearArm.wrist.x-b.rearArm.wrist.x)).toBeGreaterThan(35);
  expect(a.nearArm.upperAngle*b.rearArm.upperAngle).toBeLessThan(0);
 });
 it('knees move, planted foot remains grounded and the other lifts',()=>{
  const p=resolveRig(.25,MOVE.speed);
  expect(p.nearLeg.ankle.y).toBe(JOINTS.nearLeg.ankle.y);
  expect(p.rearLeg.ankle.y).toBeLessThan(JOINTS.rearLeg.ankle.y);
  const q=resolveRig(.75,MOVE.speed);
  expect(q.rearLeg.ankle.y).toBe(JOINTS.rearLeg.ankle.y);
  expect(q.nearLeg.ankle.y).toBeLessThan(JOINTS.nearLeg.ankle.y);
  expect(q.nearLeg.knee.x).not.toBeCloseTo(p.nearLeg.knee.x);
 });
 it('wraps without a snap',()=>{
  const end=resolveRig(1-1e-8,MOVE.speed),start=resolveRig(0,MOVE.speed);
  for(const [a,b] of [[end.nearLeg.ankle,start.nearLeg.ankle],[end.nearArm.wrist,start.nearArm.wrist],[end.rearArm.wrist,start.rearArm.wrist]]){
   expect(a.x).toBeCloseTo(b.x,3);expect(a.y).toBeCloseTo(b.y,3);
  }
 });
});
