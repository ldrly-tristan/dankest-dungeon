import { SceneKey } from '../models/scene-key.enum';

/**
 * Play scene.
 */
export class PlayScene extends Phaser.Scene {
  /**
   * Instantiate play scene.
   */
  public constructor() {
    super({ key: SceneKey.Play });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
  }
}
