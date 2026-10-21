# JOCA v0.4.2 — Caminhada com oito poses

**Em avaliação jogável.** Esta versão substitui a animação da v0.4.1 pelo novo spritesheet **de oito posições** enviado na conversa. Não utiliza articulação por partes, interpolação, deformação de desenho ou geração de quadros adicionais.

## Jogar agora

1. Extraia `joca-v0.4.2-web.zip`.
2. Abra a pasta `joca-v0.4.2` e dê dois cliques em `JOGAR.html` (Chrome/Edge).
3. Clique na área do jogo; utilize **A / D** ou **← / →** para caminhar e **R** para reiniciar.

`JOGAR.html` tem Phaser 3.90.0, código e imagens embutidos, portanto não requer instalação nem internet. A pasta `dist` pode ser servida com `node server.mjs`, se preferir.

## Alterações desta versão

- Fonte oficial da caminhada: `art-source/v0.4.2-eight-frame/source-8poses.png` (a imagem enviada), mantida **sem modificação**.
- `scripts/prepare-walk.py` extrai as **oito** imagens e as organiza, sem alterações de desenho, em `public/assets/joca-walk.png`: grade 4 × 2 com células de 560 × 560 pixels.
- Cabeça/tronco registrados aproximadamente no mesmo eixo X; base de apoio visual normalizada para Y=530 em todos os quadros.
- Phaser mostra as poses completas **0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 0**, sem sobreposições ou rigging. A velocidade dos quadros depende da distância real percorrida, não apenas do tempo.
- Mantidos motor, movimentação lateral, câmera e cenário do protótipo anterior.
- Interface, arquivo ZIP, testes e notas identificados como **v0.4.2**.

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

## Limitação artística conhecida

Os oito desenhos recebidos têm diferenças próprias de forma e pose; a preparação **não inventou posições intermediárias**. A suavidade e a alternância de pernas e braços ainda precisam da sua aprovação visual **dentro do jogo**.
