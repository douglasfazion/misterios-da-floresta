import { MOVEMENT } from './constants.js';
export type Facing = -1 | 1;
export type Motion = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'attack';
export interface MotionInput { left: boolean; right: boolean; run: boolean; }
export interface MotionState { velocityX: number; facing: Facing; traveled: number; }
export const INITIAL_MOTION: MotionState = { velocityX: 0, facing: 1, traveled: 0 };
export function direction(input: MotionInput): -1 | 0 | 1 {return Number(input.right)-Number(input.left) as -1|0|1;}
export function approach(current: number, target: number, amount: number): number {return Math.abs(current-target)<=amount?target:current+Math.sign(target-current)*amount;}
export function advanceHorizontal(state: MotionState, input: MotionInput, deltaSec: number): MotionState {
 const dt=Math.max(0,Math.min(deltaSec,0.05));const dir=direction(input);
 const target=dir*(input.run?MOVEMENT.runSpeed:MOVEMENT.walkSpeed);
 const v=approach(state.velocityX,target,(dir?MOVEMENT.acceleration:MOVEMENT.friction)*dt);
 return {velocityX:v,facing:dir===0?state.facing:dir,traveled:state.traveled+Math.abs(v)*dt};
}
export function frameForGround(traveled: number, running: boolean): number {
 const pixelsPerFrame=running?36:24;
 return Math.floor(Math.max(0,traveled)/pixelsPerFrame)%8;
}
export function jumpFrame(velocityY: number): number {return velocityY< -660?1:velocityY< -240?2:velocityY<300?3:velocityY<720?4:5;}
export function attackFrame(elapsedMs: number): number {return Math.min(11,Math.max(0,Math.floor(elapsedMs/MOVEMENT.attackMilliseconds*12)));}
export function spriteKey(motion: Motion, index: number): string {
 const pref=motion==='run'?'joca_run':motion==='jump'||motion==='fall'?'joca_jump':motion==='attack'?'joca_strike':'joca_walk';
 return `${pref}_${String(index).padStart(2,'0')}`;
}
