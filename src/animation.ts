import {ART,WORLD} from './config';
import {resolveGaitPose} from './gait';
import type {PlayerState} from './player';
/** Presentation only: gait follows distance using the corrected v0.3.9 walk sheet. */
export class PlayerVisual {
 private sprite:any;
 private seamSprite:any;
 private shadow:any;
 public currentFrame:number=ART.idleFrame;
 public seamOpacity=0;
 constructor(scene:any){
  this.shadow=scene.add.ellipse(0,WORLD.ground+3,68,10,0x000000,.38);
  const originX=ART.anchorX/ART.frameWidth;
  const originY=ART.footY/ART.frameHeight;
  const scale=ART.height/(ART.footY-65);
  this.sprite=scene.add.sprite(0,WORLD.ground,'joca',ART.idleFrame)
   .setOrigin(originX,originY).setScale(scale);
  // The second sprite is normally invisible. It appears only for the short
  // 8->1 seam and shares the same placement algorithm as the primary sprite.
  this.seamSprite=scene.add.sprite(0,WORLD.ground,'joca',0)
   .setOrigin(originX,originY).setScale(scale).setAlpha(0).setVisible(false);
 }
 update(player:PlayerState):void {
  const pose=resolveGaitPose(player.phase,player.moving);
  this.currentFrame=pose.frame;
  this.seamOpacity=pose.blend;
  const scale=ART.height/(ART.footY-65);
  this.sprite.setX(player.x).setFlipX(player.facing<0);
  this.sprite.setFrame(pose.frame);
  this.sprite.setY(WORLD.ground+(ART.footY-ART.frameBottoms[pose.frame])*scale);
  if(pose.blend>0){
   this.sprite.setAlpha(1-pose.blend);
   this.seamSprite.setVisible(true).setAlpha(pose.blend)
    .setFrame(pose.nextFrame).setX(player.x).setFlipX(player.facing<0)
    .setY(WORLD.ground+(ART.footY-ART.frameBottoms[pose.nextFrame])*scale);
  }else{
   this.sprite.setAlpha(1);
   this.seamSprite.setVisible(false).setAlpha(0);
  }
  this.shadow.setX(player.x);
 }
}
