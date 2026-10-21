import {ART} from './config';

/**
 * Presentation only: v0.3.9 returns to a minimal blend used only at the cycle seam.
 * The walk sprites themselves were corrected, so regular frame-to-frame transitions
 * stay crisp and only the 8→1 wrap gets a brief dissolve.
 */
export interface GaitPose {
 frame:number;
 nextFrame:number;
 blend:number;
}

export const SEAM_START=0.94;
export function resolveGaitPose(phase:number,moving:boolean):GaitPose {
 if(!moving || !Number.isFinite(phase)){
  return {frame:ART.idleFrame,nextFrame:ART.idleFrame,blend:0};
 }
 const normalized=((phase%1)+1)%1;
 const frame=Math.floor(normalized*ART.frames);
 if(frame!==ART.frames-1 || normalized<SEAM_START){
  return {frame,nextFrame:frame,blend:0};
 }
 const t=Math.max(0,Math.min(1,(normalized-SEAM_START)/(1-SEAM_START)));
 const blend=t*t*(3-2*t);
 return {frame,nextFrame:0,blend};
}
