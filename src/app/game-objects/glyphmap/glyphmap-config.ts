/**
 * Glyphmap configuration.
 */
export interface GlyphmapConfig extends Phaser.Types.GameObjects.GameObjectConfig {
  /**
   * Width in cells.
   */
  width?: number;

  /**
   * Height in cells.
   */
  height?: number;

  /**
   * Transpose.
   */
  transpose?: boolean;

  /**
   * Font size.
   */
  fontSize?: number;

  /**
   * Spacing.
   */
  spacing?: number;

  /**
   * Border.
   */
  border?: number;

  /**
   * Force square ratio.
   */
  forceSquareRatio?: boolean;

  /**
   * Font family.
   */
  fontFamily?: string;

  /**
   * Font style.
   */
  fontStyle?: string;

  /**
   * Foreground color.
   */
  fg?: string;

  /**
   * Background color.
   */
  bg?: string;
}
