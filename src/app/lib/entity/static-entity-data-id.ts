import { StaticCreatureDataId } from './static-creature-data-id.enum';
import { StaticItemDataId } from './static-item-data-id.enum';
import { StaticTerrainDataId } from './static-terrain-data-id.enum';

/**
 * Static entity data id type.
 */
export type StaticEntityDataId = StaticCreatureDataId | StaticItemDataId | StaticTerrainDataId;
