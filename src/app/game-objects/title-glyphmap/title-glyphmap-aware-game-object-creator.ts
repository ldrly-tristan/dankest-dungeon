import { TitleGlyphmapCreator } from './title-glyphmap-creator';

/**
 * Title glyphmap aware game object creator.
 */
export interface TitleGlyphmapAwareGameObjectCreator extends Phaser.GameObjects.GameObjectCreator {
  /**
   * Title glyphmap creator.
   */
  titleGlyphmap: TitleGlyphmapCreator;
}
