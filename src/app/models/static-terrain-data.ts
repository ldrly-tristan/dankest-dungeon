import { StaticEntityData } from './static-entity-data';

/**
 * Static terrain data interface.
 */
export interface StaticTerrainData extends StaticEntityData {
  /**
   * Block move.
   */
  blockMove: boolean;

  /**
   * Block light.
   */
  blockLight: boolean;
}
