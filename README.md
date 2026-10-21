# JOCA v0.3.9 — caminhada refinada com sprites corrigidos

**Estado: pronta para avaliação jogável.** Esta entrega corrige a caminhada de forma mais profunda: além do ajuste de apresentação, a animação agora usa um novo atlas de caminhada derivado da identidade visual aprovada de Joca, com braços e mãos mais consistentes e uma passada mais natural.

## Jogar imediatamente (Windows, Chrome/Edge)

1. Extraia todo o ZIP.
2. Dê um duplo clique em `JOGAR.html` (inclui motor e artes, sem internet, Node nem instalação).
3. Clique na área do jogo para ativar o teclado.
4. Use **A/D** ou **←/→** para caminhar e **R** para reiniciar.

**O que observar:** caminhe continuamente nos dois sentidos e avalie a fluidez geral do ciclo, principalmente braços, mãos e transição de uma passada para a outra.

## O que mudou nesta versão

- O spritesheet de caminhada foi **substituído** por uma versão corrigida, mantendo a identidade visual aprovada do Joca: mesma aparência parcialmente lupina, mesma paleta, mesmas roupas e a mesma direção artística 2D ilustrada.
- O foco da correção foi eliminar o movimento estranho nas mãos e tornar a caminhada mais fluida e natural no conjunto.
- A lógica do jogo continua baseada em deslocamento real percorrido, não em tempo isolado.
- A apresentação voltou a usar transição suave **apenas na emenda final do ciclo (8→1)**, para manter nitidez nas demais poses.
- Controles, velocidade, câmera, colisão de limites, tela e cenário existentes foram preservados.

## Estrutura e comandos de desenvolvimento

- `src/` — Phaser/TypeScript em módulos, controle, caminhada, câmera e cenário.
- `art-source/v0.3.9-walk-generated/` — atlas de caminhada corrigido usado nesta versão.
- `public/assets/` — recursos usados no jogo.
- `dist/` — compilação para servidor Web (ex.: `node server.mjs`).
- `JOGAR.html` — versão Web autocontida para abrir diretamente.
- `history/` — versões anteriores e informações de recuperação.
- `docs/` — changelog, decisões, arte e QA.

Com Node.js e acesso ao registro npm (depende da rede):

```sh
npm ci
npm run dev
npm run test
npm run build
npm run test:e2e
```

Neste ambiente, foi possível rodar:

```sh
npm run verify:art
npm run test:offline
npm run build:offline
```

A aprovação artística final da caminhada continua pendente do seu teste.
