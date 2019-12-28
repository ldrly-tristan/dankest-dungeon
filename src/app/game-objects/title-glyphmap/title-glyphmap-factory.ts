import { TitleGlyphmap } from './title-glyphmap';

/**
 * Title glyphmap factory.
 *
 * @param x Left most horizontal coordinate.
 * @param y Top most vertical coordinate.
 * @param fontSize Font size.
 * @param fontFamily Font family.
 */
export type TitleGlyphmapFactory = (x?: number, y?: number, fontSize?: number, fontFamily?: string) => TitleGlyphmap;
