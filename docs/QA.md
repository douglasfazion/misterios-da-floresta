# QA — JOCA v0.3.11

## Inspeção dos frames

`python3 scripts/check-visual-grounding.py` (precisa Pillow) compara a translação dos 8 quadros pixel a pixel com o atlas de origem e mede a dispersão vertical de topo e base por quadro. Resultados: cabeça 4 px, pés 3 px, nenhuma alteração de traço, cor, textura ou escala.

## Testes executáveis

`npm run verify:art`: confere o SHA-256 e o formato do PNG normalizado.

`npm run test:offline`: testes automatizados em Node para velocidade, direção, frenagem, limites, determinismo, progresso por distância e transição cíclica.

`npm run build:offline`: gera o jogo Phaser standalone em `JOGAR.html` e a Web build em `dist/`.

`tests/browser/`: suíte Playwright do projeto para regressão no navegador (quando instalada).

## Limites

A validação automática da estabilidade vertical detecta o erro de registro que causava o salto. Ela não substitui uma avaliação humana de qualidade artística. A segunda metade do ciclo reutiliza os desenhos anteriores, reposicionados — não se afirmou que foi feita nova animação anatômica.

## Resultados desta execução

- `npm run verify:art`: passou.
- `npm run test:offline`: **16/16 passaram**.
- `python3 scripts/check-visual-grounding.py`: passou; integridade dos oito desenhos confirmada; cabeça 4 px e pés 3 px de dispersão vertical.
- `npm run build:offline`: TypeScript compilado; `dist/` e `JOGAR.html` produzidos.
- Chromium + Python Playwright com o HTML autocontido inserido via `page.set_content`: todos os oito quadros, mesma coordenada vertical `Y=582` em todas as amostras, caminhar direita/esquerda, parar, reset, nenhuma requisição Web externa e nenhum erro de JavaScript.
- Comprovantes visuais: `docs/browser-walking-v0.3.11.png` e `docs/browser-idle-v0.3.11.png`.
- Os três atlas (fonte alinhada, public e dist) foram comparados por SHA-256 e coincidem.
- O navegador deste ambiente **bloqueou navegação `file://` e `http://localhost` por política administrativa**. Não foi possível executar esses dois testes de navegação aqui. O conteúdo da versão autocontida foi executado e validado no mesmo Chromium.
- Vitest/Playwright via npm não foram executados por falta das dependências npm instaladas no ambiente; foram usados Node `--test` e Python Playwright instalado.
