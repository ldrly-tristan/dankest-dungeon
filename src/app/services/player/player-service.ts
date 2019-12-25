import { StoreKey } from '../../lib/store';
import { PlayerStore } from '../../lib/store/player';
import { PlayerState } from '../../models/entity';
import { StoreManagerService } from '../store';

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
   * Player store.
   */
  protected readonly playerStore = (this.pluginManager.get(
    StoreManagerService.pluginObjectItem.key
  ) as StoreManagerService).get<PlayerStore>(StoreKey.Player) as PlayerStore;

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
    return this.playerStore.getValue();
  }

  /**
   * Persist player state.
   *
   * @param playerState Player state.
   */
  public persistPlayerState(playerState: Partial<PlayerState>): this {
    this.playerStore.update(playerState);
    return this;
  }
}
