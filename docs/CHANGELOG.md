# Alterações — JOCA

## v0.4.2 — Caminhada de 8 frames (2026-10-20)

- A base da caminhada passou a usar o novo spritesheet 4×2 de oito poses enviado pelo usuário.
- Extração e alinhamento sem redesenhar os quadros; atlas final 4×2, células de 560×560.
- Reprodução direta das oito imagens em sequência cíclica, sincronizada pela distância.
- Eixo vertical do sprite fixo, linha de apoio Y=530 em todas as imagens.
- Mantidos controles, câmera, cenário e arquitetura TypeScript/Phaser.
- Testes de movimentação e carregamento atualizados; ZIP anterior não sobrescrito.

## v0.4.1 — Reinício controlado da caminhada

- Caminhada simples usando spritesheet 2×2 de quatro poses.
