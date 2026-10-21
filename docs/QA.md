# QA — JOCA v0.4.0

Critérios técnicos:

1. A folha preparada deve conter exatamente quatro poses, mantendo a ordem 2×2 da fonte.
2. Todos os quadros devem tocar a mesma linha visual Y=675 na célula.
3. O jogo deve avançar os quadros conforme distância, repetir 3→0, parar em frame 0 e não alterar a posição Y do sprite.
4. Esquerda/direita, desaceleração, reversão, limites do mundo, reinício e câmera continuam funcionando.
5. `JOGAR.html` deve funcionar sem baixar imagens ou Phaser pela internet.

Critérios artísticos para avaliação humana:

- Alternância legível dos passos de Joca.
- Braços e mãos com leitura natural, sem aparentar congelamento ou vibração excessiva.
- Sem pulinhos verticais ou pés aparentemente deslizando no terreno.
- Fidelidade aos desenhos enviados (cabelo, rosto, tecidos, armaduras, orelhas e cauda).

Testes automáticos não certificam a qualidade estética. Executar e registrar somente os testes de fato realizados.

## Execução de testes (2026-10-20)

- `npm run verify:art`: **passou** — imagem original 1227×1282, atlas 1400×1400, quatro poses, Y=675 para todos os pés.
- `npm run test:offline`: **12/12 passaram** — movimento, física, limites, parada, ciclo e regressão.
- `npm run build:offline`: **passou** — TypeScript compilado e `dist/`, `JOGAR.html` gerados.
- Chromium headless com HTML autocontido: **passou** — carregamento, quatro quadros distintos, posição vertical Y=582, esquerda/direita, parada, reinício, câmera, nenhum erro JavaScript ou requisição externa.
- A tentativa de navegação direta `file://` foi bloqueada pelas permissões do ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`), portanto **não foi validada aqui**; o HTML autocontido foi carregado pelo navegador via conteúdo injetado. Ver `docs/browser-qa.json`.
- **Pendente:** avaliação artística do usuário jogando. Nem o alinhamento nem os testes de lógica garantem uma animação anatomicamente natural.
