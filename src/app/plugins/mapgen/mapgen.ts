/**
 * Map generator plugin interface.
 */
export interface Mapgen {
  /**
   * Generate arena map.
   *
   * @param width Width in cells.
   * @param height Height in cells.
   */
  arena(width?: number, height?: number): Map<string, number>;

  /**
   * Generate cellular map.
   *
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  cellular(
    width: number,
    height: number,
    options: { born?: number[]; survive?: number[]; connected?: number; generations?: number; probability?: number }
  ): Map<string, number>;
}
