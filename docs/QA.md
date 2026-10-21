# QA — JOCA v0.4.4

## Resultados observados

- `npm run verify:art`: passou (oito quadros, atlas 4×2, pés normalizados em Y=530).
- `npm run test:offline`: passou (12/12 testes de movimento, entrada, fase da animação e limite de mundo).
- `npm run build:offline`: passou (HTML standalone e `dist/`).
- Chromium via carregamento do HTML autocontido: passou com os 8 quadros, movimento em dois sentidos, parada, reinício, interface atualizada para X/8 e nenhum erro JavaScript nem requisição externa.
- Acesso `file://` diretamente a partir do ambiente de execução: **bloqueado por política do ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`)**; não é evidência de falha do jogo, mas não podemos declarar esse caminho como testado.

## Pendente

- Avaliação artística do usuário dentro do jogo: naturalidade da passada, movimento dos braços e transição do quadro 8 para o 1.
- A suíte automatizada `npm run test:e2e` completa não foi executada aqui; a checagem direta no Chromium foi executada separadamente.
