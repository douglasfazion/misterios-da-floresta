import {describe,it,expect} from 'vitest';
import {ART,MOVE,WORLD} from '../src/config';
import {createPlayer,stepPlayer,stopPlayer} from '../src/player';
import {frameForPhase} from '../src/gait';

describe('JOCA v0.3.13 — spritesheet walk',()=>{
 it('keeps earlier gameplay physics and controls stable',()=>{
  const start=createPlayer();
  let right=start;
  for(let i=0;i<120;i++)right=stepPlayer(right,1,MOVE.fixedStep);
  expect(right.x).toBeGreaterThan(start.x+150);
  expect(right.velocity).toBeLessThanOrEqual(210);
  expect(stopPlayer(right)).toMatchObject({velocity:0,moving:false});
 });
 it('displays all 12 frames and wraps immediately',()=>{
  for(let i=0;i<12;i++)expect(frameForPhase((i+.5)/12,true)).toBe(i);
  expect(frameForPhase(1,true)).toBe(0);
  expect(frameForPhase(1-1e-9,true)).toBe(11);
 });
 it('does not progress phase at a blocked boundary',()=>{
  const p={...createPlayer(),x:WORLD.maxX,velocity:0};
  expect(stepPlayer(p,1,MOVE.fixedStep).phase).toBe(p.phase);
 });
 it('uses fixed size and anchor independent of pose',()=>{
  expect(ART).toMatchObject({frames:12,frameWidth:448,frameHeight:420,footY:390});
 });
});
