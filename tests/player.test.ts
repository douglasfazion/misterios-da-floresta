import {describe,it,expect} from 'vitest';
import {ART,MOVE,WORLD,VERSION} from '../src/config';
import {createPlayer,stepPlayer,stopPlayer} from '../src/player';
import {frameForPhase} from '../src/gait';
describe('JOCA v0.4.2 — eight-pose walk',()=>{
 it('is the approved eight-frame source layout',()=>{
  expect(VERSION).toBe('0.4.2');expect(ART).toMatchObject({frames:8,frameWidth:560,frameHeight:560,footY:530,anchorX:320});
 });
 it('keeps core controls and movement rules',()=>{
  const start=createPlayer();let right=start;
  for(let i=0;i<120;i++)right=stepPlayer(right,1,MOVE.fixedStep);
  expect(right.x).toBeGreaterThan(start.x+150);expect(right.velocity).toBeLessThanOrEqual(210);
  expect(stopPlayer(right)).toMatchObject({velocity:0,moving:false});
 });
 it('shows all eight poses in order and wraps',()=>{
  for(let i=0;i<8;i++)expect(frameForPhase((i+.5)/8,true)).toBe(i);
  expect(frameForPhase(1,true)).toBe(0);expect(frameForPhase(1-1e-9,true)).toBe(7);
 });
 it('does not advance the walk at the world boundary',()=>{
  const p={...createPlayer(),x:WORLD.maxX,velocity:0};
  expect(stepPlayer(p,1,MOVE.fixedStep).phase).toBe(p.phase);
 });
});
