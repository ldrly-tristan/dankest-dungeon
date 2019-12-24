import { StaticEntityData } from '../static-entity-data';
import { StaticTerrainDataId } from './static-terrain-data-id.enum';

/**
 * Static terrain data interface.
 */
export interface StaticTerrainData extends StaticEntityData<StaticTerrainDataId> {
  /**
   * Block move.
   */
  blockMove: boolean;

  /**
   * Block light.
   */
  blockLight: boolean;
}
