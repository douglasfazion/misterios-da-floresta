import test from 'node:test';import assert from 'node:assert/strict';
import {direction,approach,advanceHorizontal,frameForGround,jumpFrame,attackFrame,spriteKey,INITIAL_MOTION} from '../runtime/phaser/core/movement.js';
import {platformBelow} from '../runtime/phaser/core/level.js';
import {PLATFORMS,MOVEMENT} from '../runtime/phaser/core/constants.js';
test('A anda para a esquerda',()=>assert.equal(direction({left:true,right:false,run:false}),-1));
test('D anda para a direita',()=>assert.equal(direction({left:false,right:true,run:false}),1));
test('direções opostas se cancelam',()=>assert.equal(direction({left:true,right:true,run:false}),0));
test('velocidade é limitada pela aceleração',()=>assert.ok(advanceHorizontal({...INITIAL_MOTION},{left:false,right:true,run:false},.016).velocityX<MOVEMENT.walkSpeed));
test('corrida é mais rápida que caminhada',()=>{
 let w={...INITIAL_MOTION},r={...INITIAL_MOTION};for(let i=0;i<60;i++){w=advanceHorizontal(w,{left:false,right:true,run:false},.016);r=advanceHorizontal(r,{left:false,right:true,run:true},.016)}assert.ok(r.velocityX>w.velocityX);
});
test('soltar tecla faz parar gradualmente',()=>{
 let s={...INITIAL_MOTION,velocityX:210};s=advanceHorizontal(s,{left:false,right:false,run:false},.05);assert.ok(s.velocityX>=0&&s.velocityX<210);
});
test('orientação permanece no repouso',()=>assert.equal(advanceHorizontal({...INITIAL_MOTION,facing:-1},{left:false,right:false,run:false},.016).facing,-1));
test('velocidade muda de sinal após inverter direção',()=>{let s={...INITIAL_MOTION,velocityX:100};for(let i=0;i<20;i++)s=advanceHorizontal(s,{left:true,right:false,run:false},.016);assert.ok(s.velocityX<0)});
test('walk usa 8 posições e reinicia após a oitava',()=>{assert.deepEqual([0,1,2,3,4,5,6,7,8,9].map(i=>frameForGround(32*i,false)),[0,1,2,3,4,5,6,7,0,1])});
test('run frames ciclam de 7 para 0',()=>{assert.equal(frameForGround(30*7,true),7);assert.equal(frameForGround(30*8,true),0);assert.equal(frameForGround(30*9,true),1)});
test('quadro não avança sem distância',()=>assert.equal(frameForGround(0,false),0));
test('sprites usam chaves corretas',()=>{assert.equal(spriteKey('walk',0),'joca_walk_00');assert.equal(spriteKey('run',7),'joca_run_07');assert.equal(spriteKey('jump',7),'joca_jump_07');assert.equal(spriteKey('attack',11),'joca_strike_11')});
test('ataque tem 12 quadros indexados 0..11',()=>{assert.equal(attackFrame(0),0);assert.equal(attackFrame(450),11)});
test('velocidade vertical define frames de salto e queda',()=>{assert.equal(jumpFrame(-1000),0);assert.equal(jumpFrame(1200),7)});
test('sombra permanece no chão durante salto',()=>assert.equal(platformBelow(200,300),586));
test('sombra encontra chão contínuo sob antiga lacuna',()=>assert.equal(platformBelow(810,500),586));
test('sombra escolhe a plataforma imediatamente abaixo',()=>assert.equal(platformBelow(500,100),440));
test('mapa do setor tem múltiplas plataformas',()=>assert.ok(PLATFORMS.length>10));
test('clamp do step horizontal evita salto de velocidade após pausa',()=>{
 const a=advanceHorizontal({...INITIAL_MOTION},{left:false,right:true,run:false},5);
 const b=advanceHorizontal({...INITIAL_MOTION},{left:false,right:true,run:false},.05);assert.deepEqual(a,b);
});
