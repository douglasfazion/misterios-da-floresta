# JOCA v0.3.13 — Caminhada de 12 quadros, integrada ao Phaser

**Status:** compilada e validada tecnicamente; a naturalidade visual ainda depende da avaliação de quem joga.

## Jogar no Windows, Chrome ou Edge

1. Extraia o ZIP completo.
2. Abra a pasta `joca-v0.3.13` e clique duas vezes em `JOGAR.html`.
3. Clique dentro da área do jogo para focar o teclado.
4. Caminhe usando **A / D** ou **← / →**. Reinicie com **R** ou o botão da tela.

`JOGAR.html` contém Phaser, JavaScript e os quatro assets ativos embutidos. Pode ser aberto sem Internet. O arquivo também foi executado no Chromium por meio de conteúdo autocontido; neste ambiente não há garantia de teste direto via URL `file://`.

## Alteração focal desta versão

A caminhada **não usa mais o sistema articulado da v0.3.12**. Foi adotada a folha de **12 quadros completos** fornecida na conversa, preservando a aparência do personagem, o cenário existente e os controles/física. A fonte está em `art-source/v0.3.13-walk/walk-input.png`.

Os quadros foram recortados, registrados por um ponto estável no tronco e alinhados pela altura visual de contato dos pés. O atlas preparado está em `public/assets/joca-walk.png` e possui grade **4×3, 448×420 px por quadro**. O script `scripts/prepare-walk.py` reproduz exatamente este preparo, sem redesenhar anatomia.

A animação é avançada de acordo com a **distância real percorrida** (12 poses a cada 168 px); a velocidade máxima do jogador permanece **210 px/s**. Não há interpolação de imagens, braços por camadas, distorções ou efeitos de sobreposição que possam criar silhuetas duplas.

## Como desenvolver

Recomendados Node.js e Python 3 com Pillow/NumPy apenas para reproduzir a preparação visual:

```sh
npm ci
npm run dev
npm run test
npm run build
npm run test:e2e
```

Para a compilação offline a partir dos arquivos já disponíveis:

```sh
npm run verify:art
npm run test:offline
npm run build:offline
```

O servidor local simples é `node server.mjs`. O diretório `dist/` contém a versão Web para servidor; `JOGAR.html` é a versão autocontida para abrir diretamente.

## Estrutura

- `src/`: motor Phaser, carregamento do atlas, animador, cenas, controle e regras de deslocamento.
- `public/assets/joca-walk.png`: atlas **ativo** no jogo.
- `art-source/v0.3.13-walk/`: arquivo recebido e manifest do registro dos frames.
- `scripts/prepare-walk.py`: preparação reprodutível do atlas.
- `tests/` e `docs/`: testes de regressão, decisões e limitações.
- `history/`: pacotes anteriores para recuperação.

## Limitações conhecidas

- A folha recebida contém poses próximas entre si em algumas posições e detalhes do desenho que podem variar entre quadros. O tratamento não redesenhou músculos, mãos ou pernas. A qualidade artística ainda precisa de inspeção em movimento.
- A pose parada ainda reaproveita um dos quadros da caminhada; idle dedicado ficará para outra iteração, somente após aprovação.
- Não foram adicionados salto, corrida, ataque ou novas salas.
