/**
 * Uniform dungeon map generator options interface.
 */
export interface UniformDungeonMapgenOptions {
  /**
   * Room width.
   */
  roomWidth: [number, number];

  /**
   * Room height
   */
  roomHeight: [number, number];

  /**
   * Room dug percentage.
   */
  roomDugPercentage: number;

  /**
   * Time limit.
   */
  timeLimit: number;
}
