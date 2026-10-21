import {WORLD} from './config';
import {RIG_PARTS,RIG_NAMES,type RigPartName} from './rigParts';
import {resolveRig,type Point,type RigPose} from './rig';
import type {PlayerState} from './player';

const ANCHOR={x:210,y:466};
const SCALE=300/(512-65);
/** Phaser presentation of Joca's articulated cutouts from the approved original. */
export class PlayerVisual {
 private root:any;
 private pieces:Record<string,any>={};
 private shadow:any;
 public currentFrame=1;
 public seamOpacity=0;
 public visualY=WORLD.ground;
 public rig:RigPose=resolveRig(0,0);
 constructor(scene:any){
  this.shadow=scene.add.ellipse(0,WORLD.ground+3,68,10,0x000000,.38);
  this.root=scene.add.container(0,WORLD.ground);
  const renderOrder:RigPartName[]=[
   'tail','rear_upper_arm','rear_forearm','rear_thigh','rear_calf','rear_foot',
   'near_thigh','near_calf','near_foot','torso','cloth','near_upper_arm','near_forearm',
  ];
  for(const name of renderOrder){
   const info=RIG_PARTS[name];
   const [px,py]=info.pivot;
   const [, ,w,h]=info.bounds;
   const obj=scene.add.image(info.at[0]-ANCHOR.x,info.at[1]-ANCHOR.y,'rig-'+name)
    .setOrigin(px/w,py/h);
   this.root.add(obj);
   this.pieces[name]=obj;
  }
  this.root.setScale(SCALE);
 }
 private segment(name:RigPartName,start:Point,rotation:number):void{
  this.pieces[name].setPosition(start.x-ANCHOR.x,start.y-ANCHOR.y).setRotation(rotation);
 }
 update(player:PlayerState):void{
  const phase=player.phase;
  this.rig=resolveRig(phase,player.velocity);
  this.currentFrame=player.moving?Math.floor((phase%1)*8):1;
  this.seamOpacity=0; // Articulations, not dissolves or overlays.
  this.root.setPosition(player.x,WORLD.ground);
  this.root.setScale(player.facing===-1?-SCALE:SCALE,SCALE);
  this.visualY=this.root.y;
  const p=this.rig;
  this.segment('rear_thigh',p.rearLeg.upper,p.rearLeg.upperAngle);
  this.segment('rear_calf',p.rearLeg.knee,p.rearLeg.lowerAngle);
  this.segment('rear_foot',p.rearLeg.ankle,p.rearLeg.footAngle);
  this.segment('near_thigh',p.nearLeg.upper,p.nearLeg.upperAngle);
  this.segment('near_calf',p.nearLeg.knee,p.nearLeg.lowerAngle);
  this.segment('near_foot',p.nearLeg.ankle,p.nearLeg.footAngle);
  this.segment('rear_upper_arm',p.rearArm.shoulder,p.rearArm.upperAngle);
  this.segment('rear_forearm',p.rearArm.elbow,p.rearArm.lowerAngle);
  this.segment('near_upper_arm',p.nearArm.shoulder,p.nearArm.upperAngle);
  this.segment('near_forearm',p.nearArm.elbow,p.nearArm.lowerAngle);
  this.pieces.tail.setRotation(.025*Math.sin(p.cycle*Math.PI*2)*p.strength);
  this.shadow.setX(player.x);
 }
 public snapshot(){
  const p=this.rig;
  return {nearAnkleX:p.nearLeg.ankle.x,nearLift:p.nearLeg.lift,
   rearAnkleX:p.rearLeg.ankle.x,rearLift:p.rearLeg.lift,
   nearWristX:p.nearArm.wrist.x,rearWristX:p.rearArm.wrist.x,
   nearKneeX:p.nearLeg.knee.x,rearKneeX:p.rearLeg.knee.x,groundY:this.visualY,
   source:'v0.3.3-articulated',rigPieces:RIG_NAMES.length};
 }
}
