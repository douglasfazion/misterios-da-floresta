import {ART} from './config';
/** Simple eight-pose cyclic sprite playback. No skeletal motion, fades or bobbing. */
export function frameForPhase(phase:number,moving:boolean):number {
 if(!moving || !Number.isFinite(phase))return ART.idleFrame;
 const normalized=((phase%1)+1)%1;
 return Math.min(ART.frames-1,Math.floor(normalized*ART.frames));
}
