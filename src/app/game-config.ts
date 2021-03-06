import { gameObjectPlugins } from './game-objects';
import { globalPlugins, scenePlugins } from './plugins';
import { scenes } from './scenes';
import { globalServices, sceneServices } from './services';

/**
 * Game configuration.
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Dankest Dungeon',
  version: '0.1.0-alpha',
  type: Phaser.AUTO,
  plugins: {
    global: [...globalPlugins, ...globalServices, ...gameObjectPlugins],
    scene: [...scenePlugins, ...sceneServices]
  },
  parent: 'body',
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 900
  },
  scene: scenes
};
