# Changelog JOCA

## v0.3.12 — Animação articulada da caminhada (2026-10-20)

- Implementado rig 2D de 13 partes derivado exatamente da arte aprovada na v0.3.3.
- Adicionada movimentação de ombros, cotovelos, quadris, joelhos, tornozelos e cauda; os braços são coordenados com a passada.
- Substituída a troca dos oito sprites de corpo inteiro por renderização articulada. Sem uso de dissolução entre poses.
- Adicionados cinemática determinística e testes específicos para braços, joelhos, pés apoiados, retorno ao repouso e continuidade do loop.
- Controles, câmera, mundo, velocidade e colisões lógicas mantidos.
- Mantida a v0.3.11 (sem históricos recursivos) para recuperação, além dos arquivos anteriores.
- **Pendente:** sua avaliação estética e eventuais ajustes de recortes, junções e sensação dos pés no chão.

## v0.3.11 — Correção de registro vertical do spritesheet

- Reposicionados os quadros 5–8 para remover o salto causado pelo desalinhamento do atlas. Ainda não havia movimento articulado de braços e pernas.
