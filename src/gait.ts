import {ART} from './config';
/** Stable 12-frame stepped animation, advanced by traveled distance, not wall clock. */
export function frameForPhase(phase:number,moving:boolean):number{
 if(!moving || !Number.isFinite(phase))return ART.idleFrame;
 const normalized=((phase%1)+1)%1;
 return Math.min(ART.frames-1,Math.floor(normalized*ART.frames));
}
