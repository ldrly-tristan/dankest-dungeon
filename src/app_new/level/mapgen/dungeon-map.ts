import { Corridor, Room } from 'rot-js/lib/map/features';

/**
 * Dungeon map interface.
 */
export interface DungeonMap {
  /**
   * Map.
   */
  map: Map<string, number>;

  /**
   * Features.
   */
  features: {
    /**
     * Rooms.
     */
    rooms: Room[];

    /**
     * Corridors.
     */
    corridor: Corridor[];
  };
}
