# Alterações — JOCA

## v0.4.1 — Reinício controlado da caminhada (2026-10-20)

- Caminhada articulada e spritesheet de 12 poses deixaram de ser usados no runtime.
- Nova fonte: folha original 2×2 de Joca fornecida pelo usuário.
- Extração e alinhamento sem redesenhar os quadros; atlas final 2×2, células de 700×700.
- Reprodução direta das quatro imagens em sequência cíclica, sincronizada pela distância.
- Eixo vertical do sprite fixo, linha de apoio Y=675 em todas as imagens.
- Mantidos controles, câmera, cenário e arquitetura TypeScript/Phaser.
- Testes de movimentação e carregamento atualizados; ZIP anterior não sobrescrito.
