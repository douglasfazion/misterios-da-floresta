# QA — JOCA v0.3.12

## Critérios de regressão

- Sem mudança nos valores aprovados de velocidade, aceleração, frenagem e limites.
- Duas pernas e dois braços respondem ao ciclo; joelhos e cotovelos movimentam-se.
- Contato do tornozelo no apoio permanece na altura nominal; o outro pé levanta.
- Tronco estável na coordenada de chão; ciclo contínuo na passagem de fase 1→0.
- Compilação Web offline e carregamento das 13 partes da identidade visual original.
- Comandos, câmera, perda de foco e reset continuam funcionando.

## Como testar

- `npm run verify:art` — integridade dos recortes e origem aprovada.
- `npm run test:offline` — testes unitários determinísticos (`node --test`).
- `npm run build:offline` — compila os módulos e recria `dist/` e `JOGAR.html`.
- `npm run test` e `npm run test:e2e` — suíte Vitest/Playwright, após `npm ci`.

A inspeção humana dentro do jogo permanece obrigatória. O modelo rígido recortado não oferece garantia automática de continuidade perfeita das juntas e deslizamento nulo.

## Resultados verificados nesta entrega

- `npm run verify:art` — passou. Origem v0.3.3 confirmada; 13/13 texturas iguais às fontes de arte por SHA-256.
- `npm run test:offline` — **9/9 testes passaram**, incluindo movimento de braços e pernas, apoio dos pés e fechamento do ciclo.
- `npm run build:offline` — compilação TypeScript, `dist/` e `JOGAR.html` gerados.
- **Chromium headless com Python Playwright**, executando o conteúdo autocontido de `JOGAR.html`: carregamento das 13 peças, caminhada direita/esquerda, animação dos dois braços e joelhos, apoio e avanço dos pés, altura do tronco fixa, parada, reinício e liberação ao perder foco. Nenhum erro JavaScript ou acesso HTTP externo observado.
- Dados medidos: deslocamento da mão próxima ~99 px, mão distante ~112 px e joelhos ~87/~80 px na coordenada da arte durante a amostragem do ciclo; estão registrados em `docs/browser-qa-v0.3.12.json`.
- **Não foi executado o comando npm `test:e2e`**: dependências npm do Playwright não estavam disponíveis neste ambiente. A execução via Python Playwright cobre os comportamentos acima, mas não substitui integralmente aquela suíte. A abertura por duplo clique (`file://`) não pôde ser validada diretamente no ambiente; o HTML inline funcionou no mesmo Chromium.
