import { GlyphmapCreator } from './glyphmap-creator';

/**
 * Glyphmap aware game object creator.
 */
export interface GlyphmapAwareGameObjectCreator extends Phaser.GameObjects.GameObjectCreator {
  /**
   * Glyphmap creator.
   */
  glyphmap: GlyphmapCreator;
}
