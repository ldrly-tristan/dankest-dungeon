import { SceneKey } from '../models/scene-key.enum';

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
    console.log(this);
  }
}
