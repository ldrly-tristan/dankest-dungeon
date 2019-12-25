import { TitleGlyphmapAwareGameObjectFactory } from '../../game-objects/title-glyphmap';
import { SceneKey } from '../scene-key.enum';

/**
 * Title scene.
 */
export class TitleScene extends Phaser.Scene {
  /**
   * Title glyphmap aware game object factory.
   */
  public readonly add: TitleGlyphmapAwareGameObjectFactory;

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
    const { centerX, centerY } = this.cameras.main;

    const titleGlyphmap = this.add.titleGlyphmap().setPosition(centerX, centerY);

    this.events.once(Phaser.Scenes.Events.TRANSITION_START, (fromScene, duration) => {
      titleGlyphmap.setAlpha(0);
      this.tweens.add({
        targets: titleGlyphmap,
        alpha: 1,
        duration,
        onComplete: () => (this.input.keyboard.enabled = true)
      });
    });
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.input.keyboard.enabled = false;
    this.input.keyboard.once(Phaser.Input.Keyboard.Events.ANY_KEY_UP, () => this.scene.start(SceneKey.Root));
  }
}
