/**
 * Boot scene.
 */
export class BootScene extends Phaser.Scene {
  /**
   * Instantiate boot scene.
   */
  public constructor() {
    super({ key: 'Boot' });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
  }
}
