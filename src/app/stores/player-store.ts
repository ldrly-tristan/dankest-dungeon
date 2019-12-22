import { Store, StoreConfig } from '@datorama/akita';

import { PlayerState } from '../models';
import { StoreKey } from './store-key.enum';

/**
 * Player store.
 */
@StoreConfig({ name: StoreKey.Player })
export class PlayerStore extends Store<PlayerState> {
  /**
   * Create initial state.
   */
  public static createInitialState(): PlayerState {
    return {
      name: '',
      staticDataId: 'player'
    };
  }

  /**
   * Instantiate player store.
   */
  public constructor() {
    super(PlayerStore.createInitialState());
  }
}
