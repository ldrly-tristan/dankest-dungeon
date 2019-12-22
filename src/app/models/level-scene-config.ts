import { StaticTerrainMap } from '../lib/level';
import { LevelData } from './level-data';

/**
 * Level scene configuration interface.
 */
export interface LevelSceneConfig extends LevelData {
  /**
   * Static terrain map.
   */
  staticTerrainMap: StaticTerrainMap;
}
