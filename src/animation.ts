import {ART,WORLD} from './config';
import {frameForPhase} from './gait';
import type {PlayerState} from './player';
/** Full-body 2D spritesheet; no articulation, scaling per-frame or crossfades. */
export class PlayerVisual {
 private sprite:any;
 private shadow:any;
 public currentFrame:number=ART.idleFrame;
 public visualY=WORLD.ground;
 public seamOpacity=0;
 constructor(scene:any){
  this.shadow=scene.add.ellipse(0,WORLD.ground+3,68,10,0x000000,.38);
  const scale=ART.height/(ART.footY-38);
  this.sprite=scene.add.sprite(0,WORLD.ground,'joca',ART.idleFrame)
   .setOrigin(ART.anchorX/ART.frameWidth,ART.footY/ART.frameHeight)
   .setScale(scale);
 }
 update(player:PlayerState):void {
  this.currentFrame=frameForPhase(player.phase,player.moving);
  this.sprite.setPosition(player.x,WORLD.ground)
   .setFlipX(player.facing<0)
   .setFrame(this.currentFrame);
  this.visualY=this.sprite.y;
  this.shadow.setX(player.x);
 }
 public snapshot(){
  return {source:'v0.3.13-12frame-spritesheet',spriteFrames:ART.frames,
   visibleFrame:this.currentFrame,groundY:this.visualY,
   scale:this.sprite.scaleX};
 }
}
