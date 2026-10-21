import {RIG_NAMES} from './rigParts';
function asset(name:string):string {
 const embedded=(window as Window & {__JOCA_ASSETS__?:Record<string,string>}).__JOCA_ASSETS__;
 return embedded?.[name] ?? `assets/${name}`;
}
export function loadAssets(scene:any):void {
 scene.load.image('bg_waterfall',asset('bg_waterfall.jpg'));
 for(const name of ['stone','moss'])scene.load.image(name,asset(`${name}.png`));
 for(const name of RIG_NAMES)scene.load.image('rig-'+name,asset(`rig/${name}.png`));
}
