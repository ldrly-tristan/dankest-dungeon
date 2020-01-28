import { Store, StoreConfig } from '@datorama/akita';

import { PlayerState } from './player-state';

/**
 * Player store.
 */
@StoreConfig({ name: 'Player' })
export class PlayerStore extends Store<PlayerState> {
  /**
   * Instantiate player store.
   */
  public constructor() {
    super({}, { resettable: true });
  }
}
