# QA — JOCA v0.3.9

## Execuções concluídas neste ambiente

1. `npm run verify:art`: passou, atlas da v0.3.3 idêntico por SHA-256 (`5570fac460293cba…`), 1536 × 1024, 8 quadros de 384 × 512.
2. `npm run test:offline`: **15/15 testes aprovados**, incluindo as regras já existentes (controles, direção, limitação de velocidade, colisão de bordas, parada, passo determinístico) e quatro novos testes de fechamento de loop, opacidade e pose parada.
3. `npm run build:offline`: compilação TypeScript AMD, `dist/index.html` e `JOGAR.html` autocontido gerados com sucesso, sem downloads npm.
4. Chromium headless (`/usr/bin/chromium`) com Python Playwright e `page.set_content` do **HTML integral**. Verificados: carregamento e versão, atlas pronto, reprodução das oito poses, sobreposição ativa durante o ciclo real, direção direita e esquerda, parada/repouso, reinício com R, câmera e ausência de requests de rede e de erros JavaScript. Resultados aprovados.
5. Verificação final do pacote ZIP e comparação de hashes dos recursos da v0.3.3.

## Limitações / não executados

- Não foi feita uma execução via `file://`/duplo clique em Windows neste ambiente; o navegador foi testado com conteúdo standalone em `about:blank`. O HTML não precisa requisitar scripts ou imagens externos.
- Vitest e a suíte npm oficial Playwright não foram executados (dependências não instaladas neste ambiente). Foram executados os testes `node:test` e testes reais no Chromium via Python Playwright.
- O ponto em aberto é **avaliar se a passagem 8→1 ficou bonita e natural** sem um rastro perceptível. Testes automatizados não substituem a decisão artística.
