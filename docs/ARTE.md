# Arte — JOCA v0.3.13

## Fontes e atlas

- `art-source/v0.3.13-walk/walk-input.png`: PNG original de 1448×1086, 4×3, 12 poses, fornecido pelo usuário nesta conversa.
- `public/assets/joca-walk.png`: grade reempacotada de 1792×1260, 4×3, células de 448×420.
- `art-source/v0.3.13-walk/registration.json`: deslocamento de cada pose usado para padronizar contato e registro horizontal do tronco.
- `scripts/prepare-walk.py`: código para reproduzir o empacotamento sem redesenhos.

A normalização preserva os pixels de cada pose. A linha inferior opaca está em Y=390 dentro de cada célula. O topo da cabeça fica entre 37 e 42 px, após normalização. Não há geração de quadros intermediários nem sobreposição no Phaser.

**Atenção:** equalizar o encaixe elimina saltos artificiais causados pela disposição da arte na folha, mas não comprova que as pernas alternem anatomicamente de maneira perfeita nem que os pés não escorreguem em pixel space. Estas propriedades continuam sujeitas a aprovação visual.
