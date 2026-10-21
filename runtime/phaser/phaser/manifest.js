import { spriteKey } from '../core/movement.js';
export const FRAME_TEXTURES = [
    ...Array.from({ length: 8 }, (_, i) => spriteKey('walk', i)),
    ...Array.from({ length: 8 }, (_, i) => spriteKey('run', i)),
    ...Array.from({ length: 6 }, (_, i) => spriteKey('jump', i)),
    ...Array.from({ length: 12 }, (_, i) => spriteKey('attack', i)),
];
export const BACKGROUNDS = ['distant_forest', 'bg_forest', 'bg_ruins', 'bg_waterfall'];
export const TILE_TEXTURES = ['stone', 'moss'];
