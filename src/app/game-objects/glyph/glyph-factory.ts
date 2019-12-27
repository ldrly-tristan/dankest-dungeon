import { GlyphData } from '../../models/entity/glyph-data';
import { Glyph } from './glyph';

/**
 * Glyph factory
 *
 * @param glyphData Glyph data.
 * @param fontSize Font size.
 * @param fontFamily Font family.
 */
export type GlyphFactory = (glyphData: GlyphData, fontSize: string, fontFamily: string) => Glyph;
