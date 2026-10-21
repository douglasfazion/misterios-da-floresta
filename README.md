# JOCA v0.4.4 — Caminhada com novo spritesheet de oito poses

**Em avaliação jogável.** Esta versão substitui a animação da v0.4.3 por um spritesheet **de oito posições** enviado por último (arquivo de origem intitulado “Corrida”). Não utiliza articulação por partes, interpolação, deformação de desenho ou geração de quadros adicionais.

## Jogar agora

1. Extraia `joca-v0.4.4-web.zip`.
2. Abra a pasta `joca-v0.4.4` e dê dois cliques em `JOGAR.html` (Chrome/Edge).
3. Clique na área do jogo; utilize **A / D** ou **← / →** para caminhar e **R** para reiniciar.

## Alterações desta versão

- Fonte oficial da caminhada: `art-source/v0.4.4-eight-frame/source-8poses.png`.
- `scripts/prepare-walk.py` extrai as **oito** imagens e as organiza, sem alterações de desenho, em `public/assets/joca-walk.png`: grade 4 × 2 com células de 560 × 560 pixels.
- Cabeça/tronco registrados aproximadamente no mesmo eixo X; base de apoio visual normalizada para Y=530 em todos os quadros.
- Phaser mostra as poses completas **0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 0**, sem sobreposições ou rigging. A velocidade dos quadros depende da distância real percorrida.
- Mantidos motor, movimentação lateral, câmera e cenário do protótipo anterior.
- Interface, arquivo ZIP, testes e notas identificados como **v0.4.4**.


## Validação realizada

- `npm run verify:art` — fonte e atlas 4×2 verificados, bases dos pés alinhadas em Y=530.
- `npm run test:offline` — 12 testes de lógica aprovados.
- `npm run build:offline` — `dist/` e `JOGAR.html` recriados.
- Chromium headless — a página autocontida carregou; frames 0–7 exibidos; movimentos direita/esquerda, parada e reinício; sem erros JavaScript ou pedidos de rede.

A animação nova é usada como **caminhada de teste** com a velocidade existente. **Não foi introduzida uma ação de corrida.** O aspecto artístico e a suavidade do loop ainda dependem da avaliação jogável do usuário.
