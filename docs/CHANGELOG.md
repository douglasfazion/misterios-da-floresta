# Alterações — JOCA

## v0.4.4 — Troca do spritesheet de 8 frames (2026-10-20)

- Substituído o atlas da caminhada v0.4.3 pelos oito desenhos do arquivo recebido "Spritesheet do Lobisomem Tribal em Corrida.png".
- Arquivo original guardado sem alteração em `art-source/v0.4.4-eight-frame/source-8poses.png`.
- Atlas reconstruído em 4×2 células de 560×560, recortes transladados sem redimensionar nem redesenhar.
- Base dos pés de todos os quadros colocada em Y=530 dentro de cada célula; pivô único mantido.
- Playback continua baseado na distância percorrida e usa sequência 0→1→2→3→4→5→6→7→0.
- Corrigida indicação na interface de pose X/4 para pose X/8 (dinâmica conforme ART.frames).
- Cenário, velocidade, controles, câmera e versão do Phaser preservados.
- Verificação da arte e 12 testes offline passaram; compilação e validação no Chromium passaram.
- Pendente: avaliação artística do usuário, sobretudo alternância dos pés e fechamento do loop.

## v0.4.3 — Spritesheet de oito poses anterior

- Primeira comparação deste novo tipo de folha com oito quadros.

## v0.4.2 — Oito poses em quatro colunas e duas linhas

- Versão preservada para comparação na conversa.
