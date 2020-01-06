/**
 * Generate digger dungeon map options interface.
 */
export interface GenerateDiggerDungeonMapOptions {
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
