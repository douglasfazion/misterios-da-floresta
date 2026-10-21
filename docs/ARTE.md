# Arte — JOCA v0.3.11

Referência de identidade: Joca humano-lupino aprovado na v0.3.3. A composição do atlas de caminhada parte dos desenhos presentes na v0.3.10. **Não houve geração nem substituição de personagens nesta versão.** Apenas posicionamos melhor os mesmos oito desenhos dentro de suas células.

## Método aplicado

Atlas de 1536 × 1024 px, 4 × 2 poses, células de 384 × 512 px. Os quatro primeiros quadros permaneceram intactos. Deslocamentos em pixels nos quatro últimos quadros: [56, 58, 59, 60] para baixo, sem interpolação de pixels.

Com critério alpha ≥128, os extremos dos desenhos por pose ficaram:

- Topo/cabeça (Y, na célula): `[105,105,104,106,103,104,102,103]` → variação **4 px**;
- Base/pé (Y, na célula): `[508,510,509,507,509,509,509,509]` → variação **3 px**.

A âncora em Y no Phaser não muda ao trocar de pose. Isso elimina os saltos causados por erros de registro da imagem, sem introduzir uma oscilação artificial. O arquivo original e os offsets estão em `art-source/v0.3.11-source/`.
