import {ART,FRAME_ORDER} from './config';
/** Eight-pose cyclic playback with an explicit atlas order to avoid the front-foot crossing artifact. */
export function frameForPhase(phase:number,moving:boolean):number {
 if(!moving || !Number.isFinite(phase))return ART.idleFrame;
 const normalized=((phase%1)+1)%1;
 const slot=Math.min(FRAME_ORDER.length-1,Math.floor(normalized*FRAME_ORDER.length));
 return FRAME_ORDER[slot];
}
