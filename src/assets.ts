import {ART} from './config';
function asset(name:string):string {
 const embedded=(window as Window & {__JOCA_ASSETS__?:Record<string,string>}).__JOCA_ASSETS__;
 return embedded?.[name] ?? `assets/${name}`;
}
export function loadAssets(scene:any):void {
 scene.load.image('bg_waterfall',asset('bg_waterfall.jpg'));
 for(const name of ['stone','moss'])scene.load.image(name,asset(`${name}.png`));
 scene.load.spritesheet('joca',asset('joca-walk.png'),{
  frameWidth:ART.frameWidth,frameHeight:ART.frameHeight,endFrame:ART.frames-1
 });
}
