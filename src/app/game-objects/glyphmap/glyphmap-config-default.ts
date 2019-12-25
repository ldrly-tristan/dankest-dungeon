import { GlyphmapConfig } from './glyphmap-config';

/**
 * Default glyphmap configuration.
 */
export const glyphmapConfigDefault: GlyphmapConfig = {
  /**
   * Width in cells.
   */
  width: 80,

  /**
   * Height in cells.
   */
  height: 25,

  /**
   * Transpose.
   */
  transpose: false,

  /**
   * Font size.
   */
  fontSize: 15,

  /**
   * Spacing.
   */
  spacing: 1,

  /**
   * Border.
   */
  border: 0,

  /**
   * Force square ratio.
   */
  forceSquareRatio: false,

  /**
   * Font family.
   */
  fontFamily: 'monospace',

  /**
   * Font style.
   */
  fontStyle: '',

  /**
   * Foreground color.
   */
  fg: '#ccc',

  /**
   * Background color.
   */
  bg: '#000'
};
