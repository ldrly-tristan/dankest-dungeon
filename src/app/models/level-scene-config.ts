import { EntityPositionIndex, StaticTerrainMap } from '../lib/level';
import { LevelData } from './level-data';
import { CreatureDataCollection } from './creature-data-collection';
import { ItemDataCollection } from './item-data-collection';
import { TerrainDataCollection } from './terrain-data-collection';

/**
 * Level scene configuration interface.
 */
export interface LevelSceneConfig extends LevelData {
  /**
   * Creature instances.
   */
  creatures: CreatureDataCollection;

  /**
   * Entity position index.
   */
  entityPositionIndex: EntityPositionIndex;

  /**
   * Items instances.
   */
  items: ItemDataCollection;
  /**
   * Static terrain map.
   */
  staticTerrainMap: StaticTerrainMap;

  /**
   * Terrain instances.
   */
  terrain: TerrainDataCollection;
}
