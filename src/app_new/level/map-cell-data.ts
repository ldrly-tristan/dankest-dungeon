import { EntityDataId } from '../entity';

/**
 * Map cell data interface. Maintains references to entity instances contained in a given map cell spatial context.
 */
export interface MapCellData {
  /**
   * Creature id.
   */
  creatureId?: EntityDataId;

  /**
   * Item ids.
   */
  itemsIds?: EntityDataId[];

  /**
   * Terrain id.
   */
  terrainId?: EntityDataId;
}
