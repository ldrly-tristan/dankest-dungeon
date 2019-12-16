import { GlyphmapFactory } from './glyphmap-factory';

/**
 * Glyphmap aware game object factory.
 */
export interface GlyphmapAwareGameObjectFactory extends Phaser.GameObjects.GameObjectFactory {
  /**
   * Glyphmap factory.
   */
  glyphmap: GlyphmapFactory;
}
