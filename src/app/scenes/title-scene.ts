import { SceneKey } from '../models/scene-key.enum';

/**
 * Title scene.
 */
export class TitleScene extends Phaser.Scene {
  /**
   * Instantiate title scene.
   */
  public constructor() {
    super({ key: SceneKey.Title });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
  }
}
