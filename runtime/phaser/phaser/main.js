import { ForestScene } from './ForestScene.js';
import { VIEW } from '../core/constants.js';
export async function startGame(mount) {
    if (!window.Phaser)
        throw new Error('Phaser não disponível');
    new Phaser.Game({
        type: Phaser.CANVAS, parent: mount, width: VIEW.width, height: VIEW.height, backgroundColor: '#071019',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        physics: { default: 'arcade', arcade: { debug: false, gravity: { x: 0, y: 0 } } },
        render: { pixelArt: false, antialias: true }, scene: [ForestScene]
    });
}
