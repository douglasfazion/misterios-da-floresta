# Alterações — JOCA

## v0.4.3 — Nova caminhada de 8 frames (2026-10-20)

- A base da caminhada passou a usar o novo spritesheet 4×2 de oito poses enviado por último pelo usuário.
- Extração e alinhamento sem redesenhar os quadros; atlas final 4×2, células de 560×560.
- Reprodução direta das oito imagens em sequência cíclica, sincronizada pela distância.
- Eixo vertical do sprite fixo, linha de apoio Y=530 em todas as imagens.
- Mantidos controles, câmera, cenário e arquitetura TypeScript/Phaser.

## v0.4.2 — Caminhada de 8 frames anterior

- Base de 8 poses anterior, agora preservada como referência recuperável.
