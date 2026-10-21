import {describe,it,expect} from 'vitest';
import {MOVE,WORLD} from '../src/config';
import {createPlayer,stepPlayer,stopPlayer,type PlayerState,type Direction} from '../src/player';
import {SEAM_START,resolveGaitPose} from '../src/gait';
function advance(initial:PlayerState,dir:Direction,seconds:number){
 let p=initial;
 for(let i=0;i<Math.round(seconds/MOVE.fixedStep);i++)p=stepPlayer(p,dir,MOVE.fixedStep);
 return p;
}
describe('movement regression — JOCA 0.3.9',()=>{
 it('starts in an idle-compatible pose',()=>{expect(createPlayer()).toMatchObject({x:180,velocity:0,facing:1,phase:1/8,moving:false});});
 it('moves in either direction at no more than 210px/s',()=>{
  for(const dir of [-1,1] as Direction[]){const p=advance({...createPlayer(),x:2000},dir,1);expect((p.x-2000)*dir).toBeGreaterThan(150);expect(Math.abs(p.velocity)).toBeLessThanOrEqual(MOVE.speed);expect(p.facing).toBe(dir);}
 });
 it('eases out and reaches true rest',()=>{
  const moving=advance(createPlayer(),1,1);
  const braking=advance(moving,0,.1);
  expect(braking.velocity).toBeGreaterThan(0);expect(braking.velocity).toBeLessThan(moving.velocity);
  const stopped=advance(braking,0,1);
  expect(stopped.velocity).toBe(0);expect(advance(stopped,0,.5).x).toBe(stopped.x);
 });
 it('changes facing only when actual movement reverses',()=>{
  const a=advance(createPlayer(),1,.7);const b=stepPlayer(a,-1,MOVE.fixedStep);
  expect(b.facing).toBe(1);expect(advance(b,-1,.4).facing).toBe(-1);
 });
 it('respects both walls',()=>{
  for(const dir of [-1,1] as Direction[]){const x=dir>0?WORLD.maxX-4:WORLD.minX+4;const p=advance({...createPlayer(),x},dir,1);expect(p.x).toBe(dir>0?WORLD.maxX:WORLD.minX);expect(p.velocity).toBe(0);expect(advance(p,dir,1).distance).toBe(p.distance);}
 });
 it('updates the gait only with travelled distance',()=>{
  const p=stepPlayer({...createPlayer(),x:WORLD.maxX-1,velocity:MOVE.speed},1,MOVE.fixedStep);
  expect(p.distance).toBe(1);expect(p.phase).toBeCloseTo(1/8+1/MOVE.stride);
 });
 it('clears velocity on lost focus',()=>{expect(stopPlayer(advance(createPlayer(),1,1)).velocity).toBe(0);});
 it('is deterministic for the same fixed steps',()=>{expect(advance(createPlayer(),1,.5)).toEqual(advance(createPlayer(),1,.5));});
 it('ignores invalid steps',()=>{const p=createPlayer();for(const d of [0,-1,NaN,Infinity])expect(stepPlayer(p,1,d)).toEqual(p);});
});

describe('walking seam — JOCA 0.3.9',()=>{
 it('maintains original 8 poses without blending before seam',()=>{
  for(let i=0;i<7;i++)expect(resolveGaitPose((i+.4)/8,true)).toMatchObject({frame:i,blend:0});
 });
 it('interpolates only 7 to 0 and matches zero pose at loop boundary',()=>{
  const p=resolveGaitPose((SEAM_START+1)/2,true);
  expect(p.frame).toBe(7);expect(p.nextFrame).toBe(0);expect(p.blend).toBeGreaterThan(0);
  expect(p.blend).toBeLessThan(1);
  expect(resolveGaitPose(1-1e-8,true).blend).toBeGreaterThan(.999999);
  expect(resolveGaitPose(0,true).frame).toBe(0);
 });
});
