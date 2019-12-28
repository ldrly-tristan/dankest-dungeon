import { TitleGlyphmap } from './title-glyphmap';
import { TitleGlyphmapConfig } from './title-glyphmap-config';

/**
 * Title glyphmap creator.
 *
 * @param config Title glyphmap configuration.
 * @param addToScene Add to scene flag.
 */
export type TitleGlyphmapCreator = (config: TitleGlyphmapConfig, addToScene?: boolean) => TitleGlyphmap;
