import { CreaturesData } from './creatures-data';
import { MapData } from './map-data';
import { ItemsData } from './items-data';
import { TerrainData } from './terrain-data';

/**
 * Level data interface.
 */
export interface LevelData {
  /**
   * Name.
   */
  name: string;

  /**
   * Seed.
   */
  seed: string;

  /**
   * Width in cells.
   */
  width: number;

  /**
   * Height in cells.
   */
  height: number;

  /**
   * Map data.
   */
  map: MapData;

  /**
   * Creature instances.
   */
  creatures: CreaturesData;

  /**
   * Item instances.
   */
  items: ItemsData;

  /**
   * Terrain instances.
   */
  terrain: TerrainData;
}
