import { SceneKey } from '../models/scene-key.enum';

/**
 * Load scene.
 */
export class LoadScene extends Phaser.Scene {
  /**
   * Instantiate load scene.
   */
  public constructor() {
    super({ key: SceneKey.Load });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
  }
}
