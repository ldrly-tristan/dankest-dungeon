import { glyphFontFamily, glyphFontSize } from '../../consts';
import { GlyphData } from '../../models/entity';

/**
 * Glyph textures service.
 */
export class GlyphTexturesService extends Phaser.Plugins.ScenePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'GlyphTexturesService',
    plugin: GlyphTexturesService,
    start: true,
    mapping: 'glyphTextures'
  };

  /**
   * Convert glyph data to texture key.
   *
   * @param glyphData Glyph data.
   */
  protected static converGlyphDataToTextureKey(glyphData: GlyphData): string {
    const { ch, fg, bg } = glyphData;

    return `${ch}${fg}${bg}`;
  }

  /**
   * Glyph source.
   */
  protected readonly glyphSource = this.scene.make.text(
    {
      text: '',
      style: {
        fontFamily: glyphFontFamily,
        fontSize: `${glyphFontSize}px`
      }
    },
    false
  );

  /**
   * Get texture & key that corresponds to specified glyph data.
   *
   * @param glyphData Glyph data.
   */
  public get(glyphData: GlyphData): { key: string; texture: Phaser.Textures.CanvasTexture } {
    const key = GlyphTexturesService.converGlyphDataToTextureKey(glyphData);

    if (this.game.textures.exists(key)) {
      return { key, texture: this.game.textures.get(key) as Phaser.Textures.CanvasTexture };
    }

    return { key, texture: this.createTexture(key, glyphData) };
  }

  /**
   * Create texture.
   *
   * @param key Texture key.
   * @param glyphData Glyph data.
   */
  protected createTexture(key: string, glyphData: GlyphData): Phaser.Textures.CanvasTexture {
    if (!this.glyphSource) {
      throw new Error('Glyph source not found');
    }

    const { ch, fg, bg } = glyphData;

    this.glyphSource.setText(ch);
    this.glyphSource.setColor(fg);
    this.glyphSource.setBackgroundColor(bg);

    const canvas = Phaser.Display.Canvas.CanvasPool.create(
      this,
      this.glyphSource.canvas.width,
      this.glyphSource.canvas.height
    );

    canvas.getContext('2d').drawImage(this.glyphSource.canvas, 0, 0);

    return this.game.textures.addCanvas(key, canvas);
  }
}
