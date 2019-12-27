import { GlyphData } from '../../models/entity';

/**
 * Glyph configuration interface.
 */
export interface GlyphConfig extends Phaser.Types.GameObjects.GameObjectConfig {
  /**
   * Glyph data.
   */
  glyphData: GlyphData;

  /**
   * The font the Text object will render with. This is a Canvas style font string.
   */
  fontFamily: string;

  /**
   * The font size, as a CSS size string.
   */
  fontSize: string;
}
