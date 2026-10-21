# Decisões — JOCA v0.3.13

## Aprovado

- TypeScript + Phaser 3.90.0, Web em ZIP versionado.
- Visual original humano-lupino do Joca deve ser respeitado.
- Priorizar naturalidade da caminhada, com teste dentro do jogo.
- Abandonar a técnica de animação articulada da v0.3.12.
- Integrar a folha de 12 poses enviada pelo usuário.

## Implementado

- Um `Phaser.GameObjects.Sprite` para o personagem; 12 frames de corpo inteiro, sem rig.
- Grade e pivôs fixos; registro prévio por posição da cabeça/ombro e contato dos pés.
- Ritmo de animação guiado pelo deslocamento real do jogador.
- Sem alteração de velocidade, aceleração, câmera, colisões ou cenário.

## Pendente

- Aceitação visual da caminhada real, especialmente passada das pernas e balanço dos braços. Testes automatizados não substituem essa avaliação.
- Não alterar funcionalidades novas até que o usuário aprove a locomoção.
