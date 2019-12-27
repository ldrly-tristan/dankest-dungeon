import { GlyphCreator } from './glyph-creator';

/**
 * Glyph aware game object creator.
 */
export interface GlyphAwareGameObjectCreator extends Phaser.GameObjects.GameObjectCreator {
  /**
   * Glyph creator.
   */
  glyph: GlyphCreator;
}
