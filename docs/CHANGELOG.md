# Changelog — JOCA

## v0.3.13 — spritesheet de 12 quadros integrado (2026-10-20)

- Abandonada a animação articulada da v0.3.12, conforme decisão do usuário.
- Integrado o spritesheet de 12 poses fornecido pelo usuário, mantendo a identidade humano-lupina de Joca.
- Preparação reprodutível do atlas: **4×3 células 448×420**, com suporte dos pés na mesma linha e posição de cabeça uniforme (variação registrada de 5 px dentro do atlas).
- Animação de corpo inteiro por textura, sem sobreposição, sem peça rotacionada e sem retiming dos controles.
- Mantidos `MOVE.speed=210`, `MOVE.stride=168`, câmera, cenário, limites e comandos.
- Testes de lógica para movimentação, 12 poses, ciclo e limites; inspeção funcional real no Chromium.
- Backup da v0.3.12 separado em `history/`.

## v0.3.12 — animação articulada (revertida nesta versão)

- Versão de 13 recortes da arte v0.3.3. Não era a apresentação desejada e foi substituída para locomoção.
