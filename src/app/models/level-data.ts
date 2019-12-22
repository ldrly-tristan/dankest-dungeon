import { MapData } from './map-data';

/**
 * Level data interface.
 */
export interface LevelData {
  /**
   * Id.
   */
  id: string;

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
}
