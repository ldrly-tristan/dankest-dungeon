import { Store, StoreConfig } from '@datorama/akita';

import { LevelState } from '../../../models/level';
import { StoreKey } from '../store-key.enum';

/**
 * Level store.
 */
@StoreConfig({ name: StoreKey.Level })
export class LevelStore extends Store<LevelState> {
  /**
   * Create initial state.
   */
  public static createInitialState(): LevelState {
    return {
      id: '',
      seed: '',
      width: 0,
      height: 0,
      map: {}
    };
  }

  /**
   * Instantiate level store.
   */
  public constructor() {
    super(LevelStore.createInitialState());
  }
}
