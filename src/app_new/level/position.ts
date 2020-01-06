import { PositionString } from './position-string';

/**
 * Position in R2 with string conversion facilities.
 */
export class Position extends Phaser.Math.Vector2 {
  /**
   * Position string regular expression.
   */
  private static readonly positionStringRegex = /^(-?\d+),(-?\d+)$/;

  /**
   * Get position from string.
   *
   * @param positionString Position string.
   */
  public static fromString(positionString: PositionString): Position {
    const matches = positionString.match(Position.positionStringRegex);

    if (!matches || matches.length !== 3) {
      throw new Error(`Invalid position string: ${positionString}`);
    }

    return new Position(parseInt(matches[1]), parseInt(matches[2]));
  }

  /**
   * Get conversion to string.
   */
  public toString(): string {
    return `${this.x},${this.y}`;
  }
}
