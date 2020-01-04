import { StaticTerrainDataId } from '../../../lib/entity';
import { StaticEntityData } from '../static-entity-data';

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
