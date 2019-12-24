import { StaticCreatureDataId } from './creature';
import { StaticItemDataId } from './item';
import { StaticTerrainDataId } from './terrain';

/**
 * Static entity data id type.
 */
export type StaticEntityDataId = StaticCreatureDataId | StaticItemDataId | StaticTerrainDataId;
