import { Corridor, Room } from 'rot-js/lib/map/features';

/**
 * Generated dungeon map interface.
 */
export interface GeneratedDungeonMap {
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
