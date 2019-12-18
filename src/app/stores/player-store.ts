import { Store, StoreConfig } from '@datorama/akita';

import { Player } from '../models/instance/player';
import { StoreKey } from './store-key.enum';

/**
 * Player store.
 */
@StoreConfig({ name: StoreKey.Player })
export class PlayerStore extends Store<Player> {
  /**
   * Create initial state.
   */
  public static createInitialState(): Player {
    return {
      name: '',
      staticId: undefined,
      position: {
        x: 0,
        y: 0
      }
    };
  }

  /**
   * Instantiate player store.
   */
  public constructor() {
    super(PlayerStore.createInitialState());
  }
}
