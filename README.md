# JOCA v0.3.12 — caminhada 2D articulada (prévia jogável)

Esta versão implementa uma nova abordagem para a caminhada de Joca **dentro do Phaser**, mantendo o código, a câmera, a velocidade, o terreno e os controles do protótipo Web anterior.

## Testar imediatamente

1. Extraia todo o ZIP e abra a pasta `joca-v0.3.12`.
2. Abra `JOGAR.html` no Chrome ou Edge. O arquivo inclui motor, código e imagens; não é necessário instalar ferramentas nem ter internet.
3. Clique no jogo. Use **A/D** ou **←/→** para caminhar. Pressione **R** para reiniciar.
4. Teste vários ciclos seguidos **nos dois sentidos**. Observe o avanço alternado dos pés, flexão dos joelhos, balanço dos braços, estabilidade vertical do tronco e junções do desenho.

## O que mudou

- **Não usa mais os oito corpos inteiros para simular a caminhada.** O Joca agora é um conjunto de **13 texturas RGBA**, recortadas do **primeiro quadro do spritesheet aprovado da v0.3.3**. Nenhuma versão visual improvisada foi adotada.
- Ombros, cotovelos, quadris e joelhos são articulados. Posição dos tornozelos calculada conforme a fase da passada, com flexão das pernas por cinemática inversa 2D.
- Braços oscilam em oposição às pernas, com flexão leve dos antebraços; a cauda acompanha discretamente a cadência.
- A fase é vinculada à distância percorrida, enquanto a intensidade da animação se ajusta à velocidade.
- O tronco permanece na mesma coordenada vertical do jogo. Cada passada alterna um pé apoiado e outro elevado. Não há efeitos de dissolução entre imagens de corpo inteiro.
- Colisão, câmera, controles, cenário e limites permaneceram inalterados.

**Limitação visual:** recortar uma ilustração pronta em juntas pode deixar emendas sutis na transição de braços e pernas. O novo movimento foi testado no navegador, mas a qualidade artística final — sobretudo apoio realista dos pés, continuidade dos recortes e peso — continua pendente da sua aprovação. Esta versão é um **teste jogável**, não a animação final garantida.

## Estrutura e comandos

- `src/rig.ts` — cinemática, fase da passada, contramovimento dos braços (regra testável sem Phaser).
- `src/animation.ts` — renderizador articulado no Phaser; `src/rigParts.ts` — metadados das peças.
- `art-source/v0.3.3-original/` — spritesheet original preservado.
- `art-source/v0.3.12-rig/` e `public/assets/rig/` — 13 recortes e pontos de articulação.
- `JOGAR.html` — jogo Web autossuficiente; `dist/` — versão Web servível.
- `tests/` — testes de movimento, cinemática e navegador.
- `history/` — versões anteriores recuperáveis.

Com Node.js e TypeScript instalados:

```sh
npm run verify:art
npm run test:offline
npm run build:offline
```

Com as dependências npm instaladas (`npm ci`), também há `npm run dev`, `npm run test`, `npm run build` e `npm run test:e2e`. O ZIP já inclui o HTML jogável compilado, sem necessidade desses comandos.
