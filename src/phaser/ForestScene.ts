import { VIEW, MOVEMENT, PLATFORMS, VERSION } from '../core/constants.js';
import { INITIAL_MOTION, advanceHorizontal, frameForGround, jumpFrame, attackFrame, spriteKey, type MotionState, type Motion } from '../core/movement.js';
import { platformBelow } from '../core/level.js';
import { FRAME_TEXTURES, BACKGROUNDS, TILE_TEXTURES } from './manifest.js';

declare const Phaser: any;
type SceneObj = any;
interface GameKeys { [key:string]:any }

export class ForestScene extends Phaser.Scene {
 private keys!:GameKeys;
 private controller!:SceneObj;
 private character!:SceneObj;
 private shadow!:SceneObj;
 private hud!:SceneObj;
 private head!:SceneObj;
 private colliders:SceneObj[]=[];
 private motion:MotionState={...INITIAL_MOTION};
 private walkDistance=0;
 private runDistance=0;
 private prevPosition=150;
 private wasGrounded=true;
 private coyote=0;
 private jumpBuffer=0;
 private attackTime=0;
 private attackCooldown=0;
 private displayedMotion:Motion='idle';
 private emitterFrame=0;
 constructor(){super({key:'ForestScene'});}

 preload():void {
  this.load.setPath('assets/');
  for(const key of FRAME_TEXTURES)this.load.image(key,key+'.png');
  for(const key of BACKGROUNDS)this.load.image(key,key+'.jpg');
  for(const key of TILE_TEXTURES)this.load.image(key,key+'.png');
  this.load.on('loaderror',(file:{key:string})=>console.error('Falha ao carregar',file.key));
 }
 create():void {
  this.cameras.main.setBackgroundColor('#071019');
  this.physics.world.setBounds(0,0,VIEW.worldWidth,VIEW.height+300);
  this.makeBackground();this.makePlatforms();this.makeTorches();
  // Independent physics capsule: changing visual sprite dimensions will never change collisions.
  this.controller=this.add.zone(150,VIEW.ground-50,61,100);
  this.physics.add.existing(this.controller,false);
  const body=this.controller.body;
  body.setSize(61,100).setCollideWorldBounds(true).setMaxVelocity(850,1200);
  body.setGravityY(MOVEMENT.gravity);
  for(const collider of this.colliders)this.physics.add.collider(this.controller,collider);
  this.character=this.add.image(150,VIEW.ground,'joca_walk_00').setOrigin(.5,1).setDisplaySize(166,184).setDepth(25);
  this.shadow=this.add.ellipse(150,VIEW.ground+3,86,13,0x010405,.38).setDepth(19);
  this.cameras.main.setBounds(0,0,VIEW.worldWidth,VIEW.height);
  this.cameras.main.startFollow(this.controller,true,.11,.1,-280,0);
  this.keys=this.input.keyboard.addKeys('A,D,LEFT,RIGHT,SHIFT,SPACE,W,UP,J,R,F3') as GameKeys;
  this.add.rectangle(16,16,470,101,0x040a0c,.85).setOrigin(0).setScrollFactor(0).setDepth(100);
  this.add.rectangle(16,16,470,101).setOrigin(0).setStrokeStyle(2,0xa38c6a).setScrollFactor(0).setDepth(101);
  this.head=this.add.text(30,28,`JOCA · AS SOMBRAS DA MATA · v${VERSION}`,{font:'bold 20px Georgia',color:'#f0d3ad'}).setScrollFactor(0).setDepth(102);
  this.hud=this.add.text(30,65,'', {font:'16px Georgia',color:'#c9d7d4'}).setScrollFactor(0).setDepth(102);
  this.add.text(30,94,'A/D mover · Shift correr · Espaço pular · J garras',{font:'14px Georgia',color:'#cab79c'}).setScrollFactor(0).setDepth(102);
  this.setCharacter('idle',0);this.motion={...INITIAL_MOTION};
  (window as unknown as {__JOCA_READY__?:boolean}).__JOCA_READY__=true;
 }
 private makeBackground():void {
  const layers=[
   {key:'distant_forest',width:1500,height:725,y:0,scroll:.035,alpha:.38},
   {key:'bg_forest',width:610,height:710,y:18,scroll:.06,alpha:.43},
   {key:'bg_ruins',width:710,height:650,y:70,scroll:.16,alpha:.47},
   {key:'bg_waterfall',width:790,height:590,y:90,scroll:.34,alpha:.78},
  ];
  for(let j=0;j<layers.length;j++){
   const layer=layers[j],count=Math.ceil((VIEW.width+VIEW.worldWidth*layer.scroll)/layer.width)+3;
   for(let i=-1;i<count;i++)this.add.image(i*layer.width,layer.y,layer.key)
    .setOrigin(0).setDisplaySize(layer.width,layer.height).setScrollFactor(layer.scroll,0).setAlpha(layer.alpha).setDepth(-100+j);
  }
  this.add.rectangle(0,0,VIEW.width,VIEW.height,0x071019,.18).setOrigin(0).setScrollFactor(0).setDepth(-70);
 }
 private makePlatforms():void {
  for(const p of PLATFORMS){
   // Arcade static body: one-way contact is simulated by vertical-only collisions.
   const platform=this.add.zone(p.x+p.w/2,p.y+10,p.w,20);
   this.physics.add.existing(platform,true);
   const staticBody=platform.body;staticBody.setSize(p.w,20);staticBody.updateFromGameObject();
   this.colliders.push(platform);
   this.add.rectangle(p.x,p.y,p.w,p.h,0x132021).setOrigin(0).setDepth(0);
   for(let j=0;j<p.w;j+=68){this.add.image(p.x+j,p.y+17,'stone').setOrigin(0).setDisplaySize(Math.min(70,p.w-j),84).setAlpha(.82).setDepth(1);
    if(p.h>110)this.add.image(p.x+j,p.y+98,'stone').setOrigin(0).setDisplaySize(Math.min(70,p.w-j),76).setAlpha(.55).setDepth(1);}
   for(let j=0;j<p.w;j+=75)this.add.image(p.x+j,p.y-15,'moss').setOrigin(0).setDisplaySize(Math.min(82,p.w-j),27).setDepth(3);
  }
 }
 private makeTorches():void {
  const graphics=this.add.graphics().setDepth(11);
  for(let x=220;x<VIEW.worldWidth;x+=465){const y=VIEW.ground-90;
   graphics.fillStyle(0x30271f).fillRect(x-4,y,8,95);
   graphics.fillStyle(0xc6672e).fillEllipse(x,y-18,15,33);
   graphics.fillStyle(0xffdb96).fillEllipse(x,y-22,5,16);
  }
 }
 private resetPlayer():void {
  const b=this.controller.body;b.reset(150,VIEW.ground-50);b.setVelocity(0,0);
  this.controller.setPosition(150,VIEW.ground-50);
  this.motion={...INITIAL_MOTION};this.walkDistance=0;this.runDistance=0;this.prevPosition=150;
  this.coyote=0;this.jumpBuffer=0;this.wasGrounded=true;this.attackTime=0;this.attackCooldown=0;
  this.character.setFlipX(false);this.setCharacter('idle',0);
 }
 private setCharacter(state:Motion,frame:number):void {
  let texture:string;let width=166,height=184;
  if(state==='attack'){texture=spriteKey('attack',frame);width=287;height=197;}
  else if(state==='jump'||state==='fall'){texture=spriteKey('jump',frame);width=130;height=184;}
  else if(state==='run'){texture=spriteKey('run',frame);width=180;height=184;}
  else texture=spriteKey('walk',state==='idle'?0:frame);
  if(this.character.texture.key!==texture)this.character.setTexture(texture);
  this.character.setDisplaySize(width,height).setOrigin(state==='attack'?190/510:.5,1);
  this.displayedMotion=state;
 }
 update(_time:number,deltaMs:number):void {
  const dt=Math.min(deltaMs/1000,.05);
  if(Phaser.Input.Keyboard.JustDown(this.keys.R)){this.resetPlayer();return;}
  const body=this.controller.body;
  const moveLeft=this.keys.A.isDown||this.keys.LEFT.isDown;
  const moveRight=this.keys.D.isDown||this.keys.RIGHT.isDown;
  const run=!!this.keys.SHIFT.isDown;
  const ground=body.blocked.down||body.touching.down;
  this.coyote=ground?.095:Math.max(0,this.coyote-dt);
  const up=this.keys.W.isDown||this.keys.UP.isDown||this.keys.SPACE.isDown;
  if(Phaser.Input.Keyboard.JustDown(this.keys.W)||Phaser.Input.Keyboard.JustDown(this.keys.UP)||Phaser.Input.Keyboard.JustDown(this.keys.SPACE))this.jumpBuffer=.13;
  this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
  if(this.jumpBuffer>0&&this.coyote>0){body.setVelocityY(MOVEMENT.jumpVelocity);this.jumpBuffer=0;this.coyote=0;}
  if(!up&&body.velocity.y< -350)body.velocity.y=Math.max(body.velocity.y,-350);
  this.attackCooldown=Math.max(0,this.attackCooldown-deltaMs);
  this.attackTime=Math.max(0,this.attackTime-deltaMs);
  if(Phaser.Input.Keyboard.JustDown(this.keys.J)&&this.attackCooldown<=0){this.attackTime=MOVEMENT.attackMilliseconds;this.attackCooldown=MOVEMENT.attackCooldownMilliseconds;}
  const canRun=run&&this.attackTime===0;
  this.motion=advanceHorizontal(this.motion,{left:moveLeft,right:moveRight,run:canRun},dt);
  // During the attack Joca retains limited directional control.
  const vx=this.motion.velocityX*(this.attackTime>0?.5:1);
  body.setVelocityX(vx);
  // Use ACTUAL world displacement to synchronize animation distance.
  const displacement=Math.abs(this.controller.x-this.prevPosition);
  this.prevPosition=this.controller.x;
  if(ground&&displacement>0.05){this.walkDistance+=displacement;this.runDistance+=displacement;}
  let anim:Motion='idle';let frame=0;
  if(this.attackTime>0){anim='attack';frame=attackFrame(MOVEMENT.attackMilliseconds-this.attackTime);}
  else if(!ground){anim=body.velocity.y<0?'jump':'fall';frame=jumpFrame(body.velocity.y);}
  else if(Math.abs(body.velocity.x)>65){anim=run&&Math.abs(body.velocity.x)>250?'run':'walk';frame=frameForGround(anim==='run'?this.runDistance:this.walkDistance,anim==='run');}
  this.setCharacter(anim,frame);
  const feet=this.controller.y+50;
  this.character.setPosition(this.controller.x,feet);
  this.character.setFlipX(this.motion.facing===-1);
  const landing=platformBelow(this.controller.x,feet);
  const height=landing===null?0:Math.max(0,landing-feet);
  const shadowScale=Math.max(.46,1-height/560);
  this.shadow.setPosition(this.controller.x,landing??VIEW.ground).setScale(shadowScale);
  this.hud.setText(`${anim.toUpperCase()}   ·   quadro ${frame+1}   ·   ${Math.round(Math.abs(body.velocity.x))} px/s`);
  if(this.controller.y>VIEW.height+190)this.resetPlayer();
 }
}
