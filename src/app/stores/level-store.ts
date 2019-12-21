import { Store, StoreConfig } from '@datorama/akita';

import { Level } from '../models/instance';
import { StoreKey } from './store-key.enum';

/**
 * Level store.
 */
@StoreConfig({ name: StoreKey.Level })
export class LevelStore extends Store<Level> {
  /**
   * Create initial state.
   */
  public static createInitialState(): Level {
    return {
      id: '',
      seed: '',
      width: 0,
      height: 0,
      diffMap: {}
    };
  }

  /**
   * Instantiate level store.
   */
  public constructor() {
    super(LevelStore.createInitialState());
  }
}
