import {MOVE,WORLD} from './config';
export type Direction=-1|0|1;
export interface PlayerState {
 x:number;velocity:number;facing:-1|1;phase:number;distance:number;moving:boolean;
}
export function createPlayer():PlayerState {
 return {x:WORLD.startX,velocity:0,facing:1,phase:0,distance:0,moving:false};
}
export function stepPlayer(state:PlayerState,direction:Direction,dt:number):PlayerState {
 if(!Number.isFinite(dt)||dt<=0)return state;
 const target=direction*MOVE.speed;
 const smoothing=1-Math.exp(-MOVE.response*dt);
 let velocity=state.velocity+(target-state.velocity)*smoothing;
 if(direction===0 && Math.abs(velocity)<MOVE.stopThreshold)velocity=0;
 const x=Math.max(WORLD.minX,Math.min(WORLD.maxX,state.x+velocity*dt));
 const actual=x-state.x;
 const distance=Math.abs(actual);
 const blocked=(x===WORLD.minX && velocity<0)||(x===WORLD.maxX && velocity>0);
 if(blocked)velocity=0;
 return {
  x,
  velocity,
  // Turn when physical displacement changes direction, not while still coasting.
  facing:actual>0?1:actual<0?-1:state.facing,
  phase:(state.phase+distance/MOVE.stride)%1,
  distance:state.distance+distance,
  moving:distance>0.00001,
 };
}
export function stopPlayer(state:PlayerState):PlayerState {
 return {...state,velocity:0,moving:false};
}
