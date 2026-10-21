# JOCA v0.3.11 — caminhada integrada e alinhamento corrigido

**Objetivo desta revisão:** corrigir o “pulinho” vertical que apareceu na v0.3.9 e permaneceu na v0.3.10. O ajuste foi aplicado à animação que o jogo Phaser realmente utiliza; não é apenas um GIF ou demonstração isolada.

## JOGAR (Windows, Chrome ou Edge)

1. Descompacte `joca-v0.3.11-web.zip` e entre na pasta `joca-v0.3.11`.
2. Abra `JOGAR.html` com Chrome ou Edge. O HTML contém scripts, motor e imagens e funciona sem internet.
3. Clique na área jogável para focar; segure **A/D** ou **←/→** para caminhar; **R** para reiniciar.
4. Caminhe por pelo menos cinco ciclos completos em cada direção. Observe os pés e a altura da cabeça: o corpo não deve dar um salto ao entrar nos quadros 5 a 8.

## Mudanças reais nesta versão

- A causa do salto era um **desalinhamento no atlas**: os desenhos 5–8 estavam aproximadamente 56–60 pixels acima das poses 1–4 dentro de suas células.
- `public/assets/joca-walk.png` foi recomposto: os quadros 5–8 foram apenas **transladados verticalmente**, sem mudar estilo, partes do personagem, escala ou anatomia.
- O renderer em `src/animation.ts` usa uma âncora vertical única no mundo; não desloca o ator ao trocar de quadro.
- **Movimentação, controles, velocidade, câmera, cenário e forma humano-lupina foram preservados.**
- Os oito quadros e o pequeno acabamento da emenda final do ciclo continuam existindo.

## Como verificar

- `npm run verify:art`: valida o atlas incluído e metadados de alinhamento.
- `python3 scripts/check-visual-grounding.py`: compara pixel a pixel com o atlas antes do alinhamento e verifica cabeças e pés (requer Pillow).
- `npm run test:offline`: testes de regras e transição com Node.
- `npm run build:offline`: compila os módulos TypeScript, atualiza `dist/` e reconstrói o `JOGAR.html` independente.

Também existe o fluxo de desenvolvimento habitual (`npm ci`, `npm run dev`, `npm run test`, `npm run test:e2e`) quando as dependências estiverem instaladas.

## Estrutura

- `src/`: código TypeScript/Phaser do jogo; `src/WalkScene.ts` é a cena jogável.
- `public/assets/joca-walk.png`: spritesheet normalizado carregado pelo jogo.
- `art-source/v0.3.11-source/`: atlas anterior, atlas normalizado e offsets documentados.
- `JOGAR.html`: versão autocontida (sem servidor ou internet).
- `dist/`: versão para hospedar em servidor Web.
- `tests/`: testes do código de movimentação e no navegador.
- `docs/`: decisões, QA e changelog.
- `history/`: versões recuperáveis anteriores.

**Limitação:** a qualidade artística ainda depende da sua validação jogável. Esta versão corrige objetivamente o deslocamento vertical introduzido na composição do spritesheet; não adiciona outras animações nem explora uma área nova do metroidvania.
