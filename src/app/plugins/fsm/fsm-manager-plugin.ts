/* eslint-disable @typescript-eslint/no-explicit-any */

import { Fsm } from './fsm';
import { FsmConfig } from './fsm-config';

/**
 * Finite state machine manager plugin.
 */
export class FsmManagerPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'FsmManagerPlugin',
    plugin: FsmManagerPlugin,
    start: true,
    mapping: 'fsmManager'
  };

  /**
   * Finite state machine cache.
   */
  protected cache = new Map<string, Fsm<any>>();

  /**
   * Instantiate finite state machine plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  /**
   * Clear finite state machine cache.
   */
  public clear(): void {
    return this.cache.clear();
  }

  /**
   * Create finite state machine & add to cache.
   *
   * @param key Key that identifies the finite state machine.
   * @param config Configuration.
   */
  public create<T>(key: string, config: FsmConfig<T>): Fsm<T> {
    let fsm = this.get<T>(key);

    if (!fsm) {
      fsm = new Fsm(config);
      this.cache.set(key, fsm);
    }

    return fsm;
  }

  /**
   * Delete a finite state machine from cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Iterate the finite state machine cache.
   *
   * @param callbackfn Callback function.
   * @param thisArg Execution context.
   */
  public forEach(callbackfn: (value: Fsm<any>, key: string, map: Map<string, Fsm<any>>) => void, thisArg?: any): void {
    return this.cache.forEach(callbackfn, thisArg);
  }

  /**
   * Get finite state machine from cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  public get<T>(key: string): Fsm<T> | void {
    return this.cache.get(key) as Fsm<T>;
  }

  /**
   * Test for finite state machine in cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Set finit state machine in cache.
   *
   * @param key Key that identifies the finite state machine.
   * @param value Finite state machine.
   */
  public set<T>(key: string, value: Fsm<T>): this {
    this.cache.set(key, value);
    return this;
  }
}
