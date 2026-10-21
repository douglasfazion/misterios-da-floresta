# Arte — caminhada de quatro poses

- Fonte entregue pelo usuário: `art-source/v0.4.0-four-frame/source-4poses.png`, 1227 × 1282 px RGBA, em dois quadrantes por linha.
- Preparação em `scripts/prepare-walk.py`: recorte dos quadrantes, retirada apenas de **espaços transparentes**, deslocamento dos desenhos sobre células idênticas; pixels e poses da arte original mantidos.
- Atlas em uso: `public/assets/joca-walk.png`, 1400 × 1400 px, 2 colunas × 2 linhas, células 700 × 700.
- Linha de apoio visual: Y=675 em todas as células. Variação mínima da altura da cabeça é normal na arte de origem.
- Exibição: frames 0,1,2,3; sem fade, sem novos desenhos, sem partículas, sem rigging.
- `registration.json` registra deslocamentos e limites por quadro.
