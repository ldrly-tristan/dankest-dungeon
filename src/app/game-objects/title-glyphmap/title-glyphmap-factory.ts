import { TitleGlyphmap } from './title-glyphmap';

/**
 * Title glyphmap factory.
 *
 * @param x Left most horizontal coordinate.
 * @param y Top most vertical coordinate.
 */
export type TitleGlyphmapFactory = (x?: number, y?: number) => TitleGlyphmap;
