import { app, plugins, scene } from './config';

/**
 * Application.
 */
export class App extends Phaser.Game {
  /**
   * Phaser game configuration.
   */
  public static readonly gameConfig: Phaser.Types.Core.GameConfig = {
    title: app.title,
    version: app.version,
    scene,
    plugins,
    type: Phaser.AUTO,
    parent: 'body',
    dom: {
      createContainer: true
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1600,
      height: 900
    }
  };

  /**
   * Instantiate application.
   */
  public constructor() {
    super(App.gameConfig);
  }
}
