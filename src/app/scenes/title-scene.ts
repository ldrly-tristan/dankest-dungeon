import { TitleGlyphmap } from '../game-objects/title-glyphmap';
import { SceneKey } from './scene-key.enum';

/**
 * Title scene.
 */
export class TitleScene extends Phaser.Scene {
  /**
   * Title glyphmap.
   */
  protected titleGlyphmap: TitleGlyphmap;

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

    this.titleGlyphmap.setPosition(centerX, centerY);

    this.events.once(Phaser.Scenes.Events.TRANSITION_START, (fromScene, duration) => {
      this.titleGlyphmap.setAlpha(0);
      this.tweens.add({
        targets: this.titleGlyphmap,
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
    this.titleGlyphmap = this.add.existing(new TitleGlyphmap(this)) as TitleGlyphmap;

    this.input.keyboard.enabled = false;
    this.input.keyboard.once(Phaser.Input.Keyboard.Events.ANY_KEY_UP, () => this.scene.start(SceneKey.Root));
  }
}
