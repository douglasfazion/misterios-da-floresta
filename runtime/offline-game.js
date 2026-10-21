
"use strict";
const canvas=document.getElementById('game'), g=canvas.getContext('2d');
const VW=1280,VH=720;canvas.width=VW;canvas.height=VH;g.imageSmoothingEnabled=true;
const keys=Object.create(null),pressed=Object.create(null);
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowLeft','ArrowRight','KeyW','KeyA','KeyD','ShiftLeft','ShiftRight','KeyR','KeyJ'].includes(e.code))e.preventDefault();if(!keys[e.code])pressed[e.code]=true;keys[e.code]=true});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k of Object.keys(keys))keys[k]=false});
const files=[...Array.from({length:8},(_,i)=>'joca_walk_'+String(i).padStart(2,'0')),...Array.from({length:8},(_,i)=>'joca_run_'+String(i).padStart(2,'0')),...Array.from({length:6},(_,i)=>'joca_jump_'+String(i).padStart(2,'0')),'stone','moss','ledge','ruin','bg_forest','bg_ruins','bg_waterfall','distant_forest',...Array.from({length:12},(_,i)=>'joca_strike_'+String(i).padStart(2,'0'))];
const asset={};let loaded=0,failed=0;
for(const n of files){const im=new Image();asset[n]=im;im.onload=()=>loaded++;im.onerror=()=>{failed++;console.warn('Não foi possível carregar',n)};im.src='assets/'+n+(n.startsWith('bg_')||n==='distant_forest'?'.jpg':'.png')}
function image(name,x,y,w,h,flip=false,alpha=1){const im=asset[name];if(!im||!im.complete||!im.naturalWidth)return false;g.save();g.globalAlpha=alpha;if(flip){g.translate(x+w,0);g.scale(-1,1);g.drawImage(im,0,y,w,h)}else g.drawImage(im,x,y,w,h);g.restore();return true}
const world=5600,G=586;
const plats=[{x:0,y:G,w:750,h:250},{x:870,y:G,w:850,h:250},{x:1850,y:G,w:860,h:250},{x:2850,y:G,w:850,h:250},{x:3840,y:G,w:1760,h:250},{x:440,y:440,w:190,h:34},{x:710,y:361,w:180,h:34},{x:1080,y:448,w:245,h:34},{x:1450,y:390,w:180,h:34},{x:1800,y:440,w:178,h:34},{x:2180,y:383,w:210,h:34},{x:2570,y:453,w:240,h:34},{x:3010,y:402,w:180,h:34},{x:3330,y:323,w:215,h:34},{x:3650,y:434,w:260,h:34},{x:4190,y:392,w:210,h:34}];
let p,cam,frame,particles,showHelp;
function reset(){p={x:105,y:G-100,w:61,h:100,vx:0,vy:0,grounded:true,face:1,step:0,coyote:0,jumpBuffer:0,dust:0,walkPhase:0,runPhase:0,gaitDistance:0,attack:0,attackCooldown:0};cam=0;frame=0;particles=[];showHelp=260}reset();
const down=(...n)=>n.some(k=>keys[k]);
function puff(x,y,n=7){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*3.8,vy:-Math.random()*2.5,life:24+Math.random()*12,size:2+Math.random()*5})}
function simulate(dt){
 if(pressed.KeyR){reset();}
 frame+=dt;
 if(p.attackCooldown>0)p.attackCooldown=Math.max(0,p.attackCooldown-dt);
 if(p.attack>0)p.attack=Math.max(0,p.attack-dt);
 if(pressed.KeyJ&&p.attackCooldown<=0){p.attack=27;p.attackCooldown=32;puff(p.x+p.w/2,p.y+p.h*.72,3)}
 const dir=Number(down('KeyD','ArrowRight'))-Number(down('KeyA','ArrowLeft'));
 if(dir)p.face=dir;
 const sprint=down('ShiftLeft','ShiftRight');
 const speed=p.attack>0?2.5:(sprint?8.5:5.2),accel=p.grounded?.24:.14;
 p.vx+=(dir*speed-p.vx)*accel*dt;if(!dir)p.vx*=Math.pow(.76,dt);
 if(pressed.Space||pressed.KeyW||pressed.ArrowUp)p.jumpBuffer=9;
 p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);p.coyote=p.grounded?8:Math.max(0,p.coyote-dt);
 if(p.jumpBuffer>0&&p.coyote>0){p.vy=-16.5;p.grounded=false;p.coyote=0;p.jumpBuffer=0;puff(p.x+p.w/2,p.y+p.h,9)}
 if(!down('Space','KeyW','ArrowUp')&&p.vy< -6)p.vy+=.64*dt;
 p.vy=Math.min(19,p.vy+.78*dt);
 const oldBottom=p.y+p.h;p.x=Math.max(0,Math.min(world-p.w,p.x+p.vx*dt));p.y+=p.vy*dt;p.grounded=false;
 for(const t of plats){if(p.x+p.w>t.x+8&&p.x<t.x+t.w-8&&oldBottom<=t.y+10&&p.y+p.h>=t.y&&p.vy>=0){p.y=t.y-p.h;p.vy=0;p.grounded=true;break}}
 if(p.grounded&&Math.abs(p.vx)>2){p.step+=Math.abs(p.vx)*dt;p.dust+=dt;if(p.dust>8){puff(p.x+p.w/2,p.y+p.h,2);p.dust=0}}else p.step=0;
 // Advance animation by actual horizontal distance, rather than a free-running timer.
 // A complete walk/run cycle always covers the same distance on the ground.
 const moving=p.grounded&&p.attack<=0&&Math.abs(p.vx)>1.2;
 const running=moving&&sprint&&Math.abs(p.vx)>3.2;
 if(moving){
   p.gaitDistance += Math.abs(p.vx)*dt;
   // Frame count and physical speed are coupled: no abrupt reset on loop wrap.
   p.walkPhase=(p.gaitDistance/24)%8;
   p.runPhase=(p.gaitDistance/36)%8;
 }
 if(p.y>VH+300){p.x=Math.max(80,p.x-250);p.y=150;p.vy=0;p.vx=0;puff(p.x,p.y,13)}
 for(const d of particles){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=.12*dt;d.life-=dt}particles=particles.filter(d=>d.life>0);
 const target=Math.max(0,Math.min(world-VW,p.x-420));cam+=(target-cam)*Math.min(1,.105*dt);
 if(showHelp>0)showHelp-=dt;
 for(const k of Object.keys(pressed))delete pressed[k];
}
function paintedBackground(){g.fillStyle='#080f18';g.fillRect(0,0,VW,VH);image('distant_forest',-cam*.035,0,1500,725,false,.38);let m=['bg_forest','bg_ruins','bg_waterfall'];for(let layer=0;layer<3;layer++){let factor=[.06,.16,.34][layer],width=[610,710,790][layer],height=[710,650,590][layer];g.save();g.globalAlpha=[.43,.47,.78][layer];let shift=-(cam*factor%width);for(let x=shift-width;x<VW+width;x+=width)image(m[layer],x,layer===0?18:layer===1?70:90,width,height);g.restore()}g.fillStyle='#08171b33';g.fillRect(0,0,VW,VH);let haze=g.createLinearGradient(0,160,0,660);haze.addColorStop(0,'#1a344500');haze.addColorStop(.7,'#60838a20');haze.addColorStop(1,'#0a141500');g.fillStyle=haze;g.fillRect(0,0,VW,VH);for(let i=0;i<22;i++){let x=((i*173-cam*.55)%(VW+300)+VW+300)%(VW+300)-140;g.strokeStyle='#071513';g.lineWidth=i%4===0?23:10;g.beginPath();g.moveTo(x,VH);g.bezierCurveTo(x+20,500,x-32,260,x+40,-50);g.stroke();g.strokeStyle='#10231f';g.lineWidth=3;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+6,230+k*80);g.quadraticCurveTo(x+50,190+k*80,x+92,190+k*80);g.stroke()}}}
function groundBlock(t){let x=t.x,y=t.y,w=t.w;if(x>cam+VW+160||x+w<cam-160)return;g.fillStyle='#132021';g.fillRect(x,y,w,t.h);for(let j=0;j<w;j+=61){image('stone',x+j,y+17,63,84,false,.82);for(let k=0;k<4;k++)image('stone',x+j,y+99+k*69,61,71,false,.55)}g.fillStyle='#111d18';g.fillRect(x,y,w,13);for(let j=0;j<w;j+=74)image('moss',x+j,y-15,82,27);g.fillStyle='#73936b';g.globalAlpha=.6;g.fillRect(x,y+3,w,3);g.globalAlpha=1;for(let j=0;j<w;j+=117){g.strokeStyle='#304c37';g.lineWidth=3;g.beginPath();g.moveTo(x+j+36,y+18);g.bezierCurveTo(x+j+43,y+46,x+j+13,y+62,x+j+35,y+86);g.stroke()}}
function torches(){for(let x=220;x<world;x+=465){let y=G-83+Math.sin(x)*8;g.fillStyle='#342920';g.fillRect(x-4,y-13,8,95);g.fillStyle='#ad5830';g.shadowColor='#ff7b2f';g.shadowBlur=26;g.beginPath();g.ellipse(x,y-20,8+Math.sin(frame*.1+x)*2,20,0,0,7);g.fill();g.fillStyle='#ffe0a1';g.beginPath();g.ellipse(x,y-25,3,9,0,0,7);g.fill();g.shadowBlur=0}}
function placeholder(x,y,w,h){g.save();g.fillStyle='#654537';g.strokeStyle='#e3b48a';g.lineWidth=3;g.fillRect(x+w*.28,y+h*.26,w*.44,h*.65);g.strokeRect(x+w*.28,y+h*.26,w*.44,h*.65);g.beginPath();g.moveTo(x+w*.3,y+h*.28);g.lineTo(x+w*.22,y);g.lineTo(x+w*.48,y+h*.12);g.lineTo(x+w*.76,y);g.lineTo(x+w*.7,y+h*.32);g.fill();g.stroke();g.restore()}
function groundUnderJoca(){let top=Infinity;const px=p.x+p.w/2,feet=p.y+p.h;for(const t of plats){if(px>=t.x&&px<=t.x+t.w&&t.y>=feet-8&&t.y<top)top=t.y;}return Number.isFinite(top)?top:null;}
function drawJoca(){
 let state='PARADO',n='joca_walk_00',kind='walk';
 const running=p.grounded&&p.attack<=0&&Math.abs(p.vx)>3.2&&down('ShiftLeft','ShiftRight');
 if(p.attack>0){
   state='ATAQUE DE GARRAS';kind='attack';
   const phase=Math.min(11,Math.floor((27-p.attack)*12/27));
   n='joca_strike_'+String(phase).padStart(2,'0');
 }else if(!p.grounded){
   state=p.vy<0?'PULANDO':'CAINDO';kind='jump';
   const j=p.vy<-11?1:p.vy<-4?2:p.vy<5?3:p.vy<12?4:5;
   n='joca_jump_'+String(j).padStart(2,'0');
 }else if(Math.abs(p.vx)>1.2){
   if(running){state='CORRENDO';kind='run';n='joca_run_'+String(Math.floor(p.runPhase)%8).padStart(2,'0');}
   else {state='ANDANDO';kind='walk';const walkOrder=[0,4,5,6,7,3,2,1];n='joca_walk_'+String(walkOrder[Math.floor(p.walkPhase)%8]).padStart(2,'0');}
 }
 const feet=p.y+p.h,groundY=groundUnderJoca(),cx=p.x+p.w/2;
 if(groundY!==null){const distance=Math.max(0,groundY-feet);const scale=Math.max(.48,1-distance/560);g.save();g.globalAlpha=.39*scale;g.fillStyle='#020506';g.beginPath();g.ellipse(cx,groundY+3,(running?54:43)*scale,7*scale,0,0,Math.PI*2);g.fill();g.restore();}
 let w=166,h=184,y=feet-h+0,x=cx-w/2;
 if(kind==='run'){w=180;h=184;y=feet-h;x=cx-w/2;}
 else if(kind==='jump'){w=150;h=184;y=feet-h;x=cx-w/2;}
 else if(kind==='attack'){h=197;w=287;x=cx-(190/510)*w;y=feet-h+9;}
 const ok=image(n,x,y,w,h,p.face<0);if(!ok)placeholder(x,y,w,h);return state;
}
function hud(state){g.fillStyle='#04090cdd';g.fillRect(18,14,395,108);g.strokeStyle='#a78c69';g.lineWidth=2;g.strokeRect(18,14,395,108);g.fillStyle='#f1d1aa';g.font='bold 20px Georgia';g.fillText('JOCA  ·  MOVIMENTO E ATAQUE · v0.5.2',33,42);g.font='15px Georgia';g.fillStyle='#c9d7d4';g.fillText('Estado: '+state+'    |    Velocidade: '+Math.round(Math.abs(p.vx)*10)/10,33,69);g.fillText('Sprites: '+loaded+'/'+files.length+' carregados'+(failed?' · '+failed+' falharam':''),33,94);g.fillStyle='#04090cdd';g.fillRect(948,16,305,78);g.strokeStyle='#a78c69';g.strokeRect(948,16,305,78);g.fillStyle='#9cb0ab';for(let i=0;i<5;i++)g.fillRect(960+i*55,49,51,12);g.fillStyle='#f2b071';g.beginPath();g.arc(960+275*p.x/world,55,6,0,Math.PI*2);g.fill();g.fillStyle='#eed6b5';g.font='14px Georgia';g.fillText('MATA AMALDIÇOADA · SETOR I',959,37);if(showHelp>0){g.fillStyle='#03080bd6';g.fillRect(244,620,792,42);g.fillStyle='#efd6ad';g.font='17px Georgia';g.textAlign='center';g.fillText('v0.5.2: nova caminhada, nova corrida e ataque de garras · J para atacar.',640,647);g.textAlign='left'}}
function draw(){g.clearRect(0,0,VW,VH);paintedBackground();g.save();g.translate(-Math.round(cam),0);for(const t of plats)groundBlock(t);torches();for(const d of particles){g.fillStyle='#bdad9688';g.fillRect(d.x,d.y,d.size,d.size)}const state=drawJoca();g.restore();hud(state)}
let last=0,acc=0;function loop(t){const delta=Math.min(50,t-last||16.667);last=t;acc+=delta;let count=0;while(acc>=16.667&&count++<4){simulate(1);acc-=16.667}draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);

window.__JOCA_READY__=true;window.__JOCA_ENGINE__='Canvas offline';window.__JOCA_DEBUG__=()=>({x:p.x,y:p.y,vy:p.vy,grounded:p.grounded,attack:p.attack,loaded,failed,frame:frame,world:world});
