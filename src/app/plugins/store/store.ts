/* eslint-disable @typescript-eslint/no-explicit-any */
import { PersistStateParams, Store as AkitaStore } from '@datorama/akita';

/**
 * Store plugin interface.
 */
export interface Store {
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
