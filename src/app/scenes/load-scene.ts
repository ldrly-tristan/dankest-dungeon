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
    // Transition to title scene.
    this.scene.transition({
      target: SceneKey.Title, // Scene key specifies the scene to transition to.
      duration: 1500, // Duration of the transition, in milliseconds.
      sleep: false, // Stop current scene (Boot) once transition is complete.
      allowInput: false, // Disable input while transition is occuring.
      onUpdate: (progress: number) => {
        // Transition update callback.

        const style = document.getElementById('splashContainer').style;

        style.opacity = (1 - progress).toString();

        if (progress === 1) {
          style.display = 'none'; // Get out of the way.
          style.opacity = '1'; // Reset opacity in case we need this later.
        }
      }
    });
  }
}
