import { Fsm } from '../../plugins/fsm';
import { Store } from '../../plugins/store';
import { PlayerStore, StoreKey } from '../../stores';
import { SceneKey } from '../scene-key.enum';

/**
 * Create player scene.
 */
export class CreatePlayerScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: Fsm;

  /**
   * Store plugin interface.
   */
  public readonly store: Store;

  /**
   * Instantiate create player scene.
   */
  public constructor() {
    super({ key: SceneKey.CreatePlayer });
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    return;
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const { centerX, centerY } = this.cameras.main;

    const createPlayerForm = this.add.dom(centerX, centerY).createFromCache('create-player-form');

    createPlayerForm.addListener('keyup').on('keyup', (event: KeyboardEvent) => {
      const name = event.target['value'].trim();

      if (name && (event.which === 13 || event.keyCode === 13 || event.key === 'Enter')) {
        const playerStore = this.store.get<PlayerStore>(StoreKey.Player);

        if (!playerStore) {
          throw new Error('Player store not found');
        }

        playerStore.update({ name });
      }
    });
  }
}
