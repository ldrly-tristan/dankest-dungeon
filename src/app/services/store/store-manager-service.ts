import { persistState, Store } from '@datorama/akita';

import { stores } from '../../lib/store';

/**
 * Store manager service.
 */
export class StoreManagerService extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'StoreManagerService',
    plugin: StoreManagerService,
    start: true,
    mapping: 'storeManager'
  };

  /**
   * Store cache.
   */
  protected readonly cache = new Map<string, Store>();

  /**
   * Persistent storage accessor.
   */
  protected readonly storage = persistState({
    key: 'ldrly-tristan/dankest-dungeon'
  });

  /**
   * Instantiate store plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    stores.forEach(S => {
      const s = new S();
      this.cache.set(s.storeName, s);
    });
  }

  /**
   * Clear storage. Only clear specified store in storage otherwise.
   *
   * @param storeName Store name.
   */
  public clear(storeName?: string): this {
    if (!this.storage) {
      throw new Error('State stores not pesisted');
    }

    this.storage.clearStore(storeName);
    return this;
  }

  /**
   * Get store from cache.
   *
   * @param key Key that identifies the store.
   */
  public get<T extends Store>(key: string): T | void {
    return this.cache.get(key) as T;
  }
}
