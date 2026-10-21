import type {Direction} from './player';
export class InputController{
 private keys=new Set<string>();
 constructor(private target:HTMLElement,private reset:()=>void,private blur:()=>void){
 window.addEventListener('keydown',this.down);window.addEventListener('keyup',this.up);
 window.addEventListener('blur',this.clear);document.addEventListener('visibilitychange',this.visibility);
 target.addEventListener('pointerdown',this.focus);
 }
 private focus=()=>this.target.focus();
 private down=(event:KeyboardEvent)=>{if(document.activeElement!==this.target)return;
 if(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyR'].includes(event.code)){event.preventDefault();this.keys.add(event.code);if(event.code==='KeyR'&&!event.repeat)this.reset();}};
 private up=(event:KeyboardEvent)=>{this.keys.delete(event.code);};
 private visibility=()=>{if(document.hidden)this.clear();};
 clear=()=>{this.keys.clear();this.blur();};
 direction():Direction{return ((Number(this.keys.has('KeyD')||this.keys.has('ArrowRight')))-(Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft')))) as Direction;}
 destroy(){window.removeEventListener('keydown',this.down);window.removeEventListener('keyup',this.up);window.removeEventListener('blur',this.clear);document.removeEventListener('visibilitychange',this.visibility);this.target.removeEventListener('pointerdown',this.focus);}
}
