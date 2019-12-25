import { Glyphmap } from './glyphmap';

/**
 * Glyphmap factory.
 *
 * @param x Left most horizontal coordinate.
 * @param y Top most vertical coordinate.
 * @param width Width in cells.
 * @param height Height in cells.
 * @param transpose Transpose.
 * @param fontSize Font size.
 * @param spacing Spacing.
 * @param border Border.
 * @param forceSquareRatio Force square ratio.
 * @param fontFamily Font family.
 * @param fontStyle Font style.
 * @param fg Foreground color.
 * @param bg Background color.
 */
export type GlyphmapFactory = (
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  transpose?: boolean,
  fontSize?: number,
  spacing?: number,
  border?: number,
  forceSquareRatio?: boolean,
  fontFamily?: string,
  fontStyle?: string,
  fg?: string,
  bg?: string
) => Glyphmap;
