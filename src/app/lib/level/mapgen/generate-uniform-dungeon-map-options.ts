/**
 * Generate uniform dungeon map options interface.
 */
export interface GenerateUniformDungeonMapOptions {
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
