import { Glyph } from './glyph';
import { GlyphConfig } from './glyph-config';

/**
 * Glyph creator.
 *
 * @param config Game object configuration.
 * @param addToScene Add to scene flag.
 */
export type GlyphCreator = (config: GlyphConfig, addToScene?: boolean) => Glyph;
