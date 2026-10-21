# Registro de versões — JOCA

## v0.3.11 — Correção real do salto vertical (2026-10-20)

- Identificada a origem: a segunda linha do atlas anterior continha personagens cerca de 60 px acima da primeira linha, apesar de o jogo tratar todas as células com a mesma âncora.
- Reposicionados os quadros 5 a 8, individualmente, em 56, 58, 59 e 60 px para baixo, alinhando altura da cabeça e contato com o chão.
- Integrado o atlas corrigido à cena Phaser; nenhuma alteração na aceleração, deslocamento, comandos ou câmera.
- Alterada a renderização para manter Y do sprite fixo durante toda a sequência.
- Incluído teste reproduzível de integridade dos pixels e de estabilidade da altura da cabeça e pés, além das regressões anteriores.
- Material ainda aguarda aprovação artística do jogador.

## v0.3.10 — Correção anterior insuficiente

- Tentou-se evitar o salto fixando a âncora no jogo, sem normalizar o conteúdo do atlas. O salto persistia devido ao próprio posicionamento do desenho nos quadros.

## v0.3.9 — Novo atlas de caminhada

- Novas poses, mas com diferença de posição vertical entre as duas linhas do atlas.

## v0.3.8 — Suavização dos membros na caminhada

- Dissolução curta durante transições; nova avaliação apontou que não bastava corrigir só a renderização.

## v0.3.7 — Ajuste da emenda do ciclo

- Pequena dissolução ao passar do último quadro para o primeiro.
