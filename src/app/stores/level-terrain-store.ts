import { EntityStore, StoreConfig } from '@datorama/akita';

import { LevelTerrainState } from '../models';
import { StoreKey } from './store-key.enum';

/**
 * Level terrain store.
 */
@StoreConfig({ name: StoreKey.LevelTerrain })
export class LevelTerrainStore extends EntityStore<LevelTerrainState> {}
