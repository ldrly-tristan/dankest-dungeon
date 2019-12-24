import { EntityPositionIndex, StaticTerrainMap } from '../../lib/level';
import { CreatureDataCollection, ItemDataCollection, TerrainDataCollection } from '../entity';
import { LevelData } from './level-data';

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
