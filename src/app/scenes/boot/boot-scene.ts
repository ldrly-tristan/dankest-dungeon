import { SceneKey } from '../scene-key.enum';

/**
 * Boot scene.
 */
export class BootScene extends Phaser.Scene {
  /**
   * Instantiate boot scene.
   */
  public constructor() {
    super({ key: SceneKey.Boot });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    // Stop boot scene and start load scene.
    this.scene.start(SceneKey.Load);
  }
}
