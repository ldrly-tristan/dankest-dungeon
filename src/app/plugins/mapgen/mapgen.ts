import { Corridor, Room } from 'rot-js/lib/map/features';

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
   * @param seed RNG seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  cellular(
    seed: string,
    width: number,
    height: number,
    options: { born?: number[]; survive?: number[]; connected?: number; generations?: number; probability?: number }
  ): Map<string, number>;

  /**
   * Generate digger dungeon map.
   *
   * @param seed RNG seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  digger(
    seed: string,
    width: number,
    height: number,
    options: {
      roomWidth?: [number, number];
      roomHeight?: [number, number];
      corridorLength?: [number, number];
      dugPercentage?: number;
      timeLimit?: number;
    }
  ): { map: Map<string, number>; features: { rooms: Room[]; corridor: Corridor[] } };
}
