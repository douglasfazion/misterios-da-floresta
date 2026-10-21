# Identidade visual e recortes — v0.3.12

A arte aprovada do **JOCA v0.3.3** é a fonte de todos os recortes. A versão jogável não usa arte redesenhada, novos acessórios nem um personagem substituto.

Em `art-source/v0.3.12-rig/` existem 13 PNGs com fundo transparente: tronco, faixa da cintura, cauda, braço distante (duas partes), braço próximo (duas partes), perna distante (coxa, canela e pé) e perna próxima (coxa, canela e pé). `rig.json` guarda as coordenadas de origem e pivôs em pixels da fonte de 384×512 px. O runtime usa metadados em `src/rigParts.ts`.

A cópia jogável está em `public/assets/rig/`. O renderizador conserva o corpo numa altura estável, posiciona os tornozelos calculados e movimenta as articulações com cinemática inversa. Detalhes mais exigentes como ajuste de oclusão, acabamento de juntas, inércia secundária de cabelo e roupa e correção de eventuais deslizamentos residuais deverão ser aprovados separadamente.

`npm run verify:art` confere as 13 imagens jogáveis com suas fontes por SHA-256, além de conferir a dimensão do spritesheet histórico.
