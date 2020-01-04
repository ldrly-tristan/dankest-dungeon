import { Store, StoreConfig } from '@datorama/akita';

import { PlayerState } from '../../../models/entity';
import { StaticCreatureDataId } from '../../entity';
import { StoreKey } from '../store-key.enum';

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
      staticEntityDataId: StaticCreatureDataId.Player
    };
  }

  /**
   * Instantiate player store.
   */
  public constructor() {
    super(PlayerStore.createInitialState());
  }
}
