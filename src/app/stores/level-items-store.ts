import { EntityStore, StoreConfig } from '@datorama/akita';

import { LevelItemsState } from '../models';
import { StoreKey } from './store-key.enum';

/**
 * Level items store.
 */
@StoreConfig({ name: StoreKey.LevelItems })
export class LevelItemsStore extends EntityStore<LevelItemsState> {}
