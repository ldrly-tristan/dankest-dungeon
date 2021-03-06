/* eslint-disable @typescript-eslint/no-empty-interface */
import { EntityState } from '@datorama/akita';

import { TerrainData } from '../entity';

/**
 * Level terrain state interface.
 */
export interface LevelTerrainState extends EntityState<TerrainData, string> {}
