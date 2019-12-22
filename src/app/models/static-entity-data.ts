import { GlyphData } from './glyph-data';

/**
 * Static entity data interface.
 */
export interface StaticEntityData {
  /**
   * Id.
   */
  id: string;

  /**
   * Name.
   */
  name: string;

  /**
   * Glyph.
   */
  glyph: GlyphData;
}
