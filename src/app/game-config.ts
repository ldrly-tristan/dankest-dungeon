import { BootScene } from './scenes/boot-scene';

/**
 * Game configuration.
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Dankest Dungeon',
  version: '0.1.0-alpha',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 900
  },
  scene: [BootScene]
};
