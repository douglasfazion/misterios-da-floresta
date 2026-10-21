import {describe,it,expect} from 'vitest';
import {ART,MOVE,WORLD,VERSION} from '../src/config';
import {createPlayer,stepPlayer,stopPlayer} from '../src/player';
import {frameForPhase} from '../src/gait';
describe('JOCA v0.4.1 — four-pose walk',()=>{
 it('is the approved four-frame source layout',()=>{
  expect(VERSION).toBe('0.4.1');expect(ART).toMatchObject({frames:4,frameWidth:700,frameHeight:700,footY:675,anchorX:430});
 });
 it('keeps core controls and movement rules',()=>{
  const start=createPlayer();let right=start;
  for(let i=0;i<120;i++)right=stepPlayer(right,1,MOVE.fixedStep);
  expect(right.x).toBeGreaterThan(start.x+150);expect(right.velocity).toBeLessThanOrEqual(210);
  expect(stopPlayer(right)).toMatchObject({velocity:0,moving:false});
 });
 it('shows all four poses in order and wraps',()=>{
  for(let i=0;i<4;i++)expect(frameForPhase((i+.5)/4,true)).toBe(i);
  expect(frameForPhase(1,true)).toBe(0);expect(frameForPhase(1-1e-9,true)).toBe(3);
 });
 it('does not advance the walk at the world boundary',()=>{
  const p={...createPlayer(),x:WORLD.maxX,velocity:0};
  expect(stepPlayer(p,1,MOVE.fixedStep).phase).toBe(p.phase);
 });
});
