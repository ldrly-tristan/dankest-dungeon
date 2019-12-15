import { gameConfig } from './game-config';

/**
 * Application.
 */
export class App extends Phaser.Game {
  /**
   * Instantiate application.
   */
  public constructor() {
    super(gameConfig);
  }
}
