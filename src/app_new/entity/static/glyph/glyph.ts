/**
 * Glyph interface.
 */
export interface Glyph {
  /**
   * Character.
   */
  ch: string;

  /**
   * Foreground color.
   */
  fg: string;

  /**
   * Background color.
   */
  bg?: string;
}
