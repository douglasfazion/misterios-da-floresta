# JOCA — As Sombras da Mata v0.5.5

## O que mudou nesta atualização
- Restaurada a corrida com **6 quadros** da v0.5.3, na ordem **6 → 7 → 8 → 3 → 1 → 5** da última folha de 8 poses selecionada anteriormente.
- **Removidos todos os buracos do chão principal**: superfície ininterrupta de x=0 até x=5600, na altura y=586.
- **Todas as 11 plataformas elevadas foram preservadas** nas mesmas posições para testar o salto.
- Corrigido o ciclo da corrida no código Phaser compilado e no Canvas offline: ele volta do sexto para o primeiro quadro, sem tentar usar sprites inexistentes.
- Arte do Joca, caminhada, salto, ataque de garras, cenário de fundo e controles foram mantidos.
- Sem inimigos.

## Abrir e jogar (offline)
1. Extraia o ZIP inteiro.
2. Abra a pasta `JOCA-v0.5.5-PHASER-ABRIR-E-JOGAR`.
3. Dê dois cliques em `index.html` para jogar sem instalação.

**Controles:** A/D ou setas = andar; Shift = correr; Espaço/W/↑ = pular; J = garras; R = reiniciar.

## Phaser + TypeScript
O projeto inclui o código-fonte Phaser 3 + TypeScript em `src/`, o JavaScript compilado em `runtime/phaser/`, testes em `tests/` e GitHub Actions. Para desenvolver/publicar a versão Phaser, execute `npm install`, `npm run check`, `npm run stage`.

Ao abrir `index.html` diretamente pelo navegador (`file://`), inicia o modo Canvas offline com os mesmos recursos. Ao abrir por HTTP(S), utiliza Phaser se disponível localmente (`vendor/phaser.min.js`, gerado por `npm run build`) ou pelo CDN. Se não houver runtime Phaser disponível, inicia Canvas. O motor Phaser não está embutido no ZIP offline.

## Verificações
`npm run typecheck` / `node --test tests/*.test.mjs` / `node scripts/audit-assets.mjs`.
