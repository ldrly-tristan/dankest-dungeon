/**
 * Map cell position.
 */
export class MapCellPosition {
  /**
   * Get coordinates from string.
   *
   * @param position Position.
   */
  public static getCoordinatesFromString(position: string): number[] {
    if (/\d+,\d+/.test(position)) {
      return position.split(',').map(v => parseInt(v));
    }

    throw new Error(`Invalid position string: ${position}`);
  }

  /**
   * X-coordinate.
   */
  public x: number;

  /**
   * Y-coordinate.
   */
  public y: number;

  /**
   * Instantiate map cell position.
   *
   * @param x X-coordinate or position string.
   * @param y Y-coordinate.
   */
  public constructor(x: number | string, y?: number) {
    if (typeof x === 'string') {
      [x, y] = MapCellPosition.getCoordinatesFromString(x);
    }

    if (y === undefined) {
      throw new Error('Y-coordinate undefined');
    }

    this.x = x;
    this.y = y;
  }

  /**
   * To string.
   */
  public toString(): string {
    return `${this.x},${this.y}`;
  }
}
