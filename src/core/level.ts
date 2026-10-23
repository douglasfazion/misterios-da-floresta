import { PLATFORMS, type PlatformRect } from './constants.js';
export function platformBelow(x: number, feet: number, platforms: readonly PlatformRect[]=PLATFORMS): number | null {
 let best=Infinity;
 for(const p of platforms)if(x>=p.x&&x<=p.x+p.w&&p.y>=feet-8&&p.y<best)best=p.y;
 return Number.isFinite(best)?best:null;
}
export function horizontalOverlap(x:number,width:number,p:PlatformRect):boolean{return x+width>p.x&&x<p.x+p.w;}
