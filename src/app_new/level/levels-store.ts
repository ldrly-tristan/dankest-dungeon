import { EntityStore, StoreConfig } from '@datorama/akita';

import { LevelsState } from './levels-state';

/**
 * Levels store.
 */
@StoreConfig({ name: 'Levels' })
export class LevelsStore extends EntityStore<LevelsState> {}