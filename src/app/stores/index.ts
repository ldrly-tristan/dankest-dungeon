import { LevelCreaturesStore, LevelItemsStore, LevelStore, LevelTerrainStore } from './level';
import { PlayerStore } from './player';

export { StoreKey } from './store-key.enum';

/**
 * Game stores.
 */
export const stores = [PlayerStore, LevelStore, LevelCreaturesStore, LevelTerrainStore, LevelItemsStore];
