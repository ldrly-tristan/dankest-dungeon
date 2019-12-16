import { SceneKey } from '../../models/scene-key.enum';

/**
 * Root scene.
 */
export class RootScene extends Phaser.Scene {
  /**
   * Instantiate root scene.
   */
  public constructor() {
    super({ key: SceneKey.Root });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
  }
}
