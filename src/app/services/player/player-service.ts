import { PlayerState } from '../../models/entity';
import { StorePlugin } from '../../plugins/store';
import { StoreKey } from '../../stores';
import { PlayerStore } from '../../stores/player';

/**
 * Player service.
 */
export class PlayerService extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'PlayerService',
    plugin: PlayerService,
    start: true,
    mapping: 'player'
  };

  /**
   * Instantiate player service.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  /**
   * Get player state.
   */
  public getPlayerState(): PlayerState {
    return this.getStore().getValue();
  }

  /**
   * Persist player state.
   *
   * @param playerState Player state.
   */
  public persistPlayerState(playerState: Partial<PlayerState>): this {
    this.getStore().update(playerState);
    return this;
  }

  /**
   * Get store.
   */
  protected getStore(): PlayerStore {
    const storePlugin = this.pluginManager.get(StorePlugin.pluginObjectItem.key) as StorePlugin;

    if (!storePlugin) {
      throw new Error('Store plugin not found');
    }

    const playerStore = storePlugin.get<PlayerStore>(StoreKey.Player);

    if (!playerStore) {
      throw new Error('Player store not found');
    }

    return playerStore;
  }
}
