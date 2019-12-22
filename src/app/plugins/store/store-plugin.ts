/* eslint-disable @typescript-eslint/no-explicit-any */
import { persistState, PersistStateParams, Store as AkitaStore } from '@datorama/akita';

/**
 * Store plugin interface.
 */
export interface StorePlugin {
  /**
   * Clear store cache.
   */
  clear(): void;

  /**
   * Delete a store from cache.
   *
   * @param key Key that identifies the store.
   */
  delete(key: string): boolean;

  /**
   * Iterate the store cache.
   *
   * @param callbackfn Callback function.
   * @param thisArg Execution context.
   */
  forEach<T extends AkitaStore>(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void;

  /**
   * Get store from cache.
   *
   * @param key Key that identifies the store.
   */
  get<T extends AkitaStore>(key: string): T | void;

  /**
   * Test for store in cache.
   *
   * @param key Key that identifies the store.
   */
  has(key: string): boolean;

  /**
   * Trigger state store persistence.
   *
   * @param params Persist state parameters.
   */
  persistState(
    params?: Partial<PersistStateParams>
  ): {
    destroy(): void;
    clearStore(storeName?: string): void;
  };

  /**
   * Register state stores.
   *
   * @param stores Stores.
   */
  register<T extends AkitaStore>(stores: T | T[]): this;

  /**
   * Set store in cache.
   *
   * @param key Key that identifies the store.
   * @param value Store.
   */
  set<T extends AkitaStore>(key: string, value: T): this;

  /**
   * Clear storage. Only clear specified store in storage otherwise.
   *
   * @param storeName Store name.
   */
  storageClear(storeName?: string): this;

  /**
   * Stop syncing the state.
   */
  storageDestroy(): void;
}

/**
 * Store plugin.
 */
export class StorePlugin extends Phaser.Plugins.BasePlugin implements StorePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'StorePlugin',
    plugin: StorePlugin,
    start: true,
    mapping: 'store'
  };

  /**
   * Store cache.
   */
  protected cache = new Map<string, AkitaStore>();

  /**
   * Persistent storage accessor.
   */
  protected storage: {
    destroy(): void;
    clearStore(storeName?: string): void;
  };

  /**
   * Instantiate store plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  /**
   * Clear store cache.
   */
  public clear(): void {
    return this.cache.clear();
  }

  /**
   * Delete a store from cache.
   *
   * @param key Key that identifies the store.
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Iterate the store cache.
   *
   * @param callbackfn Callback function.
   * @param thisArg Execution context.
   */
  public forEach<T extends AkitaStore>(
    callbackfn: (value: T, key: string, map: Map<string, T>) => void,
    thisArg?: any
  ): void {
    return this.cache.forEach(callbackfn, thisArg);
  }

  /**
   * Get store from cache.
   *
   * @param key Key that identifies the store.
   */
  public get<T extends AkitaStore>(key: string): T | void {
    return this.cache.get(key) as T;
  }

  /**
   * Test for store in cache.
   *
   * @param key Key that identifies the store.
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Trigger state store persistence.
   *
   * @param params Persist state parameters.
   */
  public persistState(
    params?: Partial<PersistStateParams>
  ): {
    destroy(): void;
    clearStore(storeName?: string): void;
  } {
    if (this.storage) {
      throw new Error('State stores already persisted');
    }

    return (this.storage = persistState(params));
  }

  /**
   * Register state stores.
   *
   * @param stores Stores.
   */
  public register<T extends AkitaStore>(stores: T | T[]): this {
    if (!Array.isArray(stores)) {
      stores = [stores];
    }

    stores.forEach(s => this.cache.set(s.storeName, s));

    return this;
  }

  /**
   * Set store in cache.
   *
   * @param key Key that identifies the store.
   * @param value Store.
   */
  set<T extends AkitaStore>(key: string, value: T): this {
    this.cache.set(key, value);
    return this;
  }

  /**
   * Clear storage. Only clear specified store in storage otherwise.
   *
   * @param storeName Store name.
   */
  public storageClear(storeName?: string): this {
    if (!this.storage) {
      throw new Error('State stores not pesisted');
    }

    this.storage.clearStore(storeName);
    return this;
  }

  /**
   * Stop syncing the state.
   */
  public storageDestroy(): void {
    if (!this.storage) {
      throw new Error('State stores not pesisted');
    }

    return this.storage.destroy();
  }
}
