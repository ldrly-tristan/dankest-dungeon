import { GlyphData } from './glyph-data';

/**
 * Static entity data interface.
 */
export interface StaticEntityData<T> {
  /**
   * Id.
   */
  id: T;

  /**
   * Name.
   */
  name: string;

  /**
   * Glyph.
   */
  glyph: GlyphData;
}
