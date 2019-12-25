import { TitleGlyphmapFactory } from './title-glyphmap-factory';

/**
 * Title glyphmap aware game object factory.
 */
export interface TitleGlyphmapAwareGameObjectFactory extends Phaser.GameObjects.GameObjectFactory {
  /**
   * Title glyphmap factory.
   */
  titleGlyphmap: TitleGlyphmapFactory;
}
