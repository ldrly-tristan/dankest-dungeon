import { TitleGlyphmap } from './title-glyphmap';

/**
 * Title glyphmap creator.
 *
 * @param config Game object configuration.
 * @param addToScene Add to scene flag.
 */
export type TitleGlyphmapCreator = (
  config: Phaser.Types.GameObjects.GameObjectConfig,
  addToScene?: boolean
) => TitleGlyphmap;
