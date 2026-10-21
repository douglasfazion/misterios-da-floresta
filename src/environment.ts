import {WORLD} from './config';
/** Existing modular provisional floor / backdrop, no new biome or room. */
export function createEnvironment(scene:any):void {
 scene.cameras.main.setBackgroundColor('#071019');
 for(let i=-1;i<6;i++){
  scene.add.image(i*1280,0,'bg_waterfall').setOrigin(0).setDisplaySize(1280,720)
   .setScrollFactor(.16).setFlipX(Math.abs(i)%2===1).setAlpha(.72);
 }
 scene.add.rectangle(640,360,1280,720,0x071019,.22).setScrollFactor(0);
 scene.add.rectangle(WORLD.width/2,WORLD.ground+100,WORLD.width,200,0x192421);
 for(let x=0;x<WORLD.width;x+=80){
  scene.add.image(x,WORLD.ground+14,'stone').setOrigin(0).setDisplaySize(82,120).setAlpha(.78);
  scene.add.image(x,WORLD.ground-15,'moss').setOrigin(0).setDisplaySize(89,28).setAlpha(.92);
 }
 scene.add.rectangle(WORLD.width/2,WORLD.ground,WORLD.width,3,0x7e966e,.58);
}
