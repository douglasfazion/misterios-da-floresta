# Decisões e pendências — JOCA v0.3.9

## Aprovado

- Tipo: metroidvania 2D Web, com desenvolvimento incremental e versionado.
- Tecnologia: TypeScript + Phaser.
- Base visual obrigatória: identidade aprovada do Joca parcialmente lupino.
- Escopo atual: resolver a caminhada antes de avançar para outras mecânicas.
- Entregar somente ZIPs com numeração de versão.

## Implementado nesta versão

- Como a suavização por código não foi suficiente para deixar a caminhada plenamente natural, a animação passou a usar um **novo atlas de caminhada** consistente com a identidade aprovada.
- O sistema de caminhada permanece guiado por distância real percorrida.
- A suavização visual ficou restrita novamente à emenda 8→1, para não borrar braços e mãos entre todas as poses.

## Pendência

- Falta sua avaliação jogável da fluidez final da caminhada. Se ainda houver problema, continuaremos nesta mesma iteração em vez de abrir escopo novo.

## Preservação

- O atlas jogável atual está salvo em `art-source/v0.3.9-walk-generated/`.
- As versões anteriores permanecem recuperáveis em `history/`.
