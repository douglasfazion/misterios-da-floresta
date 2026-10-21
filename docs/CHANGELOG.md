# Changelog — JOCA

## v0.3.9 — caminhada refinada com atlas corrigido (2026-10-20)

- **Escopo:** resolver de forma definitiva o problema de fluidez da caminhada, com permissão para alterar os sprites mantendo a identidade aprovada.
- **Correção principal:** substituído o atlas `public/assets/joca-walk.png` por um novo spritesheet de 8 poses, preservando a identidade visual do Joca e corrigindo especialmente braços, mãos e consistência da passada.
- **Apresentação:** `src/gait.ts` voltou para uma dissolução curta apenas na emenda 8→1. As demais trocas entre poses permanecem nítidas.
- **Ajuste técnico:** recalibrados `footY` e `frameBottoms` em `src/config.ts` para o novo atlas.
- **Preservado:** controles, velocidade, física, câmera, cenário e estrutura TypeScript + Phaser.
- **Testes:** verificação do atlas, testes offline de movimento/transição e validação no Chromium passaram; `dist/` e `JOGAR.html` foram recompilados.

## v0.3.8 — suavização pontual das mãos na caminhada

- Refinamento somente de apresentação, sem troca do spritesheet.

## v0.3.7 — ajuste fino do reinício da caminhada

- Corrigido o tranco percebido na passagem do último quadro para o primeiro.
