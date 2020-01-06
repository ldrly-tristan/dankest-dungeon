import { EntityDataId, TerrainData as TerrainInstanceData } from '../entity';

/**
 * Terrain data type.
 */
export type TerrainData = Record<EntityDataId, TerrainInstanceData>;
