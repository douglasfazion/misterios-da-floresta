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
test('walk frames ciclam de 7 para 0',()=>{assert.equal(frameForGround(24*7,false),7);assert.equal(frameForGround(24*8,false),0)});
test('run frames ciclam de 7 para 0',()=>{assert.equal(frameForGround(36*7,true),7);assert.equal(frameForGround(36*8,true),0)});
test('quadro não avança sem distância',()=>assert.equal(frameForGround(0,false),0));
test('sprites usam chaves corretas',()=>{assert.equal(spriteKey('walk',0),'joca_walk_00');assert.equal(spriteKey('run',5),'joca_run_05');assert.equal(spriteKey('jump',2),'joca_jump_02');assert.equal(spriteKey('attack',11),'joca_strike_11')});
test('ataque tem 12 quadros indexados 0..11',()=>{assert.equal(attackFrame(0),0);assert.equal(attackFrame(450),11)});
test('velocidade vertical define frames de salto e queda',()=>{assert.equal(jumpFrame(-1000),1);assert.equal(jumpFrame(1200),5)});
test('sombra permanece no chão durante salto',()=>assert.equal(platformBelow(200,300),586));
test('sombra ignora plataformas fora do alcance horizontal',()=>assert.equal(platformBelow(810,600),null));
test('sombra escolhe a plataforma imediatamente abaixo',()=>assert.equal(platformBelow(500,100),440));
test('mapa do setor tem múltiplas plataformas',()=>assert.ok(PLATFORMS.length>10));
test('clamp do step horizontal evita salto de velocidade após pausa',()=>{
 const a=advanceHorizontal({...INITIAL_MOTION},{left:false,right:true,run:false},5);
 const b=advanceHorizontal({...INITIAL_MOTION},{left:false,right:true,run:false},.05);assert.deepEqual(a,b);
});
