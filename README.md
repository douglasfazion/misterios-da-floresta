# JOCA v0.4.6 — Correção do ciclo usando as mesmas sprites

**Em avaliação jogável.** Esta versão mantém o mesmo spritesheet de oito posições da v0.4.5, mas corrige a **ordem de reprodução** para reduzir o trecho em que o pé da frente parecia passar por trás.

## Jogar agora

1. Extraia `joca-v0.4.6-web.zip`.
2. Abra a pasta `joca-v0.4.6` e dê dois cliques em `JOGAR.html` (Chrome/Edge).
3. Clique na área do jogo; utilize **A / D** ou **← / →** para caminhar e **R** para reiniciar.

## Alterações desta versão

- Mesma fonte oficial da caminhada: `art-source/v0.4.5-eight-frame/source-8poses.png`.
- Mantidos o atlas, as imagens e o alinhamento dos pés.
- **Apenas a ordem da animação foi corrigida** para: `0 → 4 → 1 → 5 → 2 → 6 → 3 → 7 → 0`.
- Objetivo da correção: eliminar o trecho em que a leitura do pé da frente parecia inverter ou cruzar atrás.
- Mantidos motor, movimentação lateral, câmera e cenário do protótipo anterior.
