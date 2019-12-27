import { GlyphFactory } from './glyph-factory';

/**
 * Glyph aware game object factory.
 */
export interface GlyphAwareGameObjectFactory extends Phaser.GameObjects.GameObjectFactory {
  /**
   * Glyph factory.
   */
  glyph: GlyphFactory;
}
