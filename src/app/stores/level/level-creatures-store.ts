import { EntityStore, StoreConfig } from '@datorama/akita';

import { LevelCreaturesState } from '../../models/level';
import { StoreKey } from '../store-key.enum';

/**
 * Level creatures store.
 */
@StoreConfig({ name: StoreKey.LevelCreatures })
export class LevelCreaturesStore extends EntityStore<LevelCreaturesState> {}
