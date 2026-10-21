# JOCA — As Sombras da Mata v0.5.0

## Abra e jogue imediatamente

1. Extraia **o ZIP inteiro** para uma pasta.
2. Abra **index.html** com Chrome, Edge ou Firefox.
3. Controles: **A/D** ou setas — andar; **Shift** — correr; **Espaço / W / ↑** — pular; **J** — garras; **R** — reiniciar.

O arquivo abre **offline** (modo Canvas de compatibilidade), sem Node, servidores nem instalação. O código do projeto principal está implementado em **Phaser 3.90.0 + TypeScript**, com lógica, cenário e testes divididos em módulos. **Ao publicar por http(s), o jogo usa Phaser** carregando `vendor/phaser.min.js` (copiado durante o build pelo npm) ou, caso não exista, o CDN. Se ambos estiverem indisponíveis, ativa o Canvas de compatibilidade. O Phaser não está fisicamente embutido no ZIP, então abrir por duplo clique utiliza Canvas e não Phaser. Isso evita prometer funcionamento offline do Phaser sem a biblioteca.

## Escopo restaurado
- Cenário Mata Amaldiçoada e câmera lateral
- Caminhada e corrida (8 quadros cada)
- Pulo e queda (6 quadros)
- Ataque lateral de garras (12 quadros) — o mesmo conjunto visual da v0.3.1
- Plataformas, sombra projetada no chão e reinício
- **Sem inimigos**

## Estrutura
- `index.html` — entrada para jogar, online e offline
- `assets/` — sprites e cenário da versão restaurada v0.3.1
- `src/core/` — lógica pura, movimento e geometria testáveis
- `src/phaser/` — cena e integração Phaser 3
- `runtime/phaser/` — JavaScript compilado do TypeScript
- `runtime/offline-game.js` — adaptação executável da v0.3.1 para abrir offline por duplo clique
- `tests/` — testes de lógica, ciclo, salto, ataque e estrutura
- `.github/workflows/pages.yml` — publicação automática no GitHub Pages

## Desenvolvimento
```bash
npm install
npm run check
npm run preview
```
Abra `http://localhost:4173`. `npm run build` compila o código e copia a biblioteca Phaser instalada em `vendor/phaser.min.js`; `npm run stage` monta a pasta `site/`, que o GitHub Actions publica. Assim a publicação não depende do CDN. Neste ZIP, a biblioteca Phaser não está embutida porque o pacote npm não pôde ser obtido durante a preparação. O modo offline continua pronto para jogar.

## Observações
- Mantivemos a arte da v0.3.1; os problemas artísticos das imagens não são magicamente resolvidos pela troca de motor.
- Os testes automatizados validam regras e arquivos. A versão Canvas offline pode ser testada diretamente no navegador. A versão Phaser depende da disponibilidade do runtime externo e precisa de validação visual adicional.
- Versão: **v0.5.0**, migração arquitetural. A versão restaurada jogável de referência é a **v0.3.1**.
