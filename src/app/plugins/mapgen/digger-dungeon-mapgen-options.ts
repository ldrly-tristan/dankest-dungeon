/**
 * Digger dungeon map generator options interface.
 */
export interface DiggerDungeonMapgenOptions {
  /**
   * Room width.
   */
  roomWidth?: [number, number];

  /**
   * Room height.
   */
  roomHeight?: [number, number];

  /**
   * Corridor length.
   */
  corridorLength?: [number, number];

  /**
   * Dug percentage.
   */
  dugPercentage?: number;

  /**
   * Time limit.
   */
  timeLimit?: number;
}
