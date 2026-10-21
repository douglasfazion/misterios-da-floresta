import Phaser from './phaser-runtime';
import {VERSION,MOVE} from './config';
import {createPlayer,stepPlayer,stopPlayer} from './player';
import {InputController} from './input';
import {loadAssets} from './assets';
import {createEnvironment} from './environment';
import {PlayerVisual} from './animation';
import {updateCamera} from './camera';

export class WalkScene extends Phaser.Scene {
 private player=createPlayer();
 private inputController!:InputController;
 private visual!:PlayerVisual;
 private accumulator=0;
 private failed=false;
 private ready=false;
 constructor(){super('walk');}
 preload():void {
  this.load.on('loaderror',()=>{
   this.failed=true;
   document.querySelector('#status')!.textContent='Erro ao carregar os desenhos. Experimente o servidor local.';
  });
  loadAssets(this);
 }
 create():void {
  if(this.failed)return;
  createEnvironment(this);
  this.visual=new PlayerVisual(this);
  this.visual.update(this.player);
  this.inputController=new InputController(document.querySelector('#game')!,()=>this.reset(),()=>{
   this.player=stopPlayer(this.player);
   this.accumulator=0;
  });
  const button=document.querySelector('#reset')!;
  const reset=()=>{this.reset();(document.querySelector('#game') as HTMLElement).focus();};
  button.addEventListener('click',reset);
  this.events.once('shutdown',()=>{this.inputController.destroy();button.removeEventListener('click',reset);});
  this.ready=true;
  if(new URLSearchParams(location.search).has('test') || (window as Window & {__JOCA_TEST_MODE__?:boolean}).__JOCA_TEST_MODE__){
   Object.assign(window,{__JOCA__:{
    snapshot:()=>({...this.player,frame:this.visual.currentFrame,cameraX:this.cameras.main.scrollX,
     version:VERSION,ready:this.ready,textureReady:this.textures.exists('joca'),seamOpacity:this.visual.seamOpacity,visualY:this.visual.visualY,...this.visual.snapshot()}),
    reset:()=>this.reset(),
   }});
  }
 }
 private reset():void {
  this.player=createPlayer();
  this.accumulator=0;
  this.cameras.main.scrollX=0;
  this.visual.update(this.player);
 }
 update(_time:number,delta:number):void {
  if(!this.ready)return;
  this.accumulator+=Math.min(delta/1000,.1);
  while(this.accumulator>=MOVE.fixedStep){
   this.player=stepPlayer(this.player,this.inputController.direction(),MOVE.fixedStep);
   this.accumulator-=MOVE.fixedStep;
  }
  this.visual.update(this.player);
  updateCamera(this.cameras.main,this.player.x,Math.min(delta/1000,.1));
  document.querySelector('#status')!.textContent=`${this.player.moving?'Caminhando':'Parado'} · ${Math.round(Math.abs(this.player.velocity))} px/s · pose ${this.visual.currentFrame+1}/12 · spritesheet`;
 }
}
