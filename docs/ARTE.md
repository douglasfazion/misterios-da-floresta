# Arte e animação — JOCA v0.3.9

**Fonte visual jogável:** atlas corrigido em `art-source/v0.3.9-walk-generated/joca-walk.png`, copiado para `public/assets/joca-walk.png` e `dist/assets/joca-walk.png`.

- PNG RGBA 1536 × 1024; 8 poses em 4 colunas × 2 linhas; cada célula tem 384 × 512 px.
- A identidade aprovada do Joca foi mantida: forma humano-lupina, cabelo escuro, orelhas, cauda, faixas vermelhas, adereços e estilo 2D ilustrado sombrio.
- O novo atlas corrige a leitura da caminhada, principalmente braços e mãos, e melhora a progressão entre poses.
- Direção do desenho voltada à direita, invertida no Phaser quando anda à esquerda.
- A progressão de quadros depende apenas da distância percorrida, não do tempo isolado.
- A emenda final 8→1 recebe uma breve sobreposição; as demais transições exibem os quadros de forma direta para preservar nitidez.
- `npm run verify:art` confirma que o atlas embarcado é idêntico ao atlas corrigido salvo em `art-source/v0.3.9-walk-generated/`.
