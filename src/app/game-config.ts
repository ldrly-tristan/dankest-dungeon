import { globalPlugins } from './plugins';
import { scenes } from './scenes';
import { globalServices } from './services';

/**
 * Game configuration.
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Dankest Dungeon',
  version: '0.1.0-alpha',
  type: Phaser.AUTO,
  plugins: {
    global: [...globalPlugins, ...globalServices]
  },
  parent: 'body',
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450
  },
  scene: scenes
};
