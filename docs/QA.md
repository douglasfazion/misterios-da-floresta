# QA — JOCA v0.3.13

## Testes realizados

- `npm run verify:art`: passou; confere a grade 4×3, 12 poses, linha de suporte e variação aceitável de registro.
- `npm run test:offline`: **11/11 passaram**; locomover à esquerda/direita, frenagem, limites, transição de direção, determinismo, 12 poses, wrap 11→0 e sincronização por distância.
- `npm run build:offline`: compilação TypeScript e geração de `dist/` e `JOGAR.html` passaram.
- Chromium headless com Python Playwright, executando `JOGAR.html` via conteúdo autocontido: spritesheet carregada, 12/12 frames observados, movimento nos dois sentidos, parada, inversão, reinício, posição vertical de sprite constante (582 px), ausência de erros JS e HTTP externo. Capturas `qa-frame6.png` e `qa-v0.3.13-browser.png`.

## Limitações do teste

- Não foi executada integralmente a suíte `npm test` / `npm run test:e2e`: dependências npm não estavam instaladas neste runtime. Executamos a suíte offline e o fluxo Python Playwright.
- O comando de abertura por duplo clique no Windows (protocolo `file://`) não foi executado neste runtime.
- Avaliação humana da naturalidade da passada e das mãos continua necessária.
