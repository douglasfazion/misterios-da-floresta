import {WORLD} from './config';
export function updateCamera(camera:any,x:number,dt:number):void {
 const target=Math.max(0,Math.min(WORLD.width-1280,x-480));
 camera.scrollX+=(target-camera.scrollX)*(1-Math.exp(-4.5*dt));
}
