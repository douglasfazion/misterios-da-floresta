# JOCA v0.4.0 — Reinício da caminhada com quatro poses

**Em avaliação jogável.** Esta versão substitui a animação da v0.3.13 pela imagem **de quatro posições** que foi fornecida na conversa. Não utiliza articulação por partes, interpolação, deformação de desenho ou geração de quadros adicionais.

## Jogar agora

1. Extraia `joca-v0.4.0-web.zip`.
2. Abra a pasta `joca-v0.4.0` e dê dois cliques em `JOGAR.html` (Chrome/Edge).
3. Clique na área do jogo; utilize **A / D** ou **← / →** para caminhar e **R** para reiniciar.

`JOGAR.html` tem Phaser 3.90.0, código e imagens embutidos, portanto não requer instalação nem internet. A pasta `dist` pode ser servida com `node server.mjs`, se preferir.

## Alterações desta versão

- Fonte oficial da caminhada: `art-source/v0.4.0-four-frame/source-4poses.png` (a imagem enviada), mantida **sem modificação**.
- `scripts/prepare-walk.py` extrai as **quatro** imagens e as organiza, sem alterações de desenho, em `public/assets/joca-walk.png`: grade 2 × 2 com células de 700 × 700 pixels.
- Cabeça/tronco registrados aproximadamente no mesmo eixo X; base de apoio visual normalizada para Y=675 em todos os quadros.
- Phaser mostra as poses completas **0 → 1 → 2 → 3 → 0**, sem sobreposições ou rigging. A velocidade dos quadros depende da distância real percorrida, não apenas do tempo.
- Mantidos motor, movimentação lateral, câmera e cenário do protótipo anterior. O reinício visual **não** equivale a criar um jogo novo do zero.
- Interface, arquivo ZIP, testes e notas identificados como **v0.4.0**.

## Rodar e testar o código

Com Node.js e dependências instaladas (`npm ci`):

```sh
npm run dev
npm run test
npm run build
npm run test:e2e
```

A execução offline deste pacote usa `tsc` e Node.js:

```sh
python scripts/prepare-walk.py  # Pillow + NumPy, apenas se desejar reconstruir o atlas
npm run verify:art
npm run test:offline
npm run build:offline
node server.mjs
```

## Conteúdo

- `src/` — movimento, entrada, renderização, cena, ambiente e câmera separados.
- `public/assets/` — arte usada pelo Phaser.
- `art-source/v0.4.0-four-frame/` — imagem original e registro de preparação.
- `scripts/` — compilação independente e preparação reprodutível do atlas.
- `tests/` — regras de movimento, ciclo de quatro quadros e testes de navegador.
- `docs/` — decisões, changelog, critérios de teste e licença do Phaser.

## Limitação artística conhecida

Os quatro desenhos recebidos têm diferenças próprias de forma e pose; uma grade de quatro imagens não garante, por si só, um ciclo anatomicamente perfeito. A preparação **não inventou posições intermediárias**. A suavidade e a alternância de pernas e braços ainda precisam da sua aprovação visual **dentro do jogo**. Não adicionamos corrida, salto ou ataque.

Versões antigas, incluindo `joca-v0.3.13-web.zip`, são preservadas separadamente e não foram sobrescritas.
