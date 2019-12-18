/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeState } from 'typestate';

import { Fsm } from './fsm';

/**
 * Finite state machine plugin.
 */
export class FsmPlugin extends Phaser.Plugins.BasePlugin implements Fsm {
  /**
   * Finite state machine cache.
   */
  protected cache = new Map<string, TypeState.FiniteStateMachine<any>>();

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
   * @param startState Start state.
   * @param allowImplicitSelfTransition Allow implicit self transition flag.
   */
  public create<T>(key: string, startState: T, allowImplicitSelfTransition?: boolean): TypeState.FiniteStateMachine<T> {
    let fsm = this.get<T>(key);

    if (!fsm) {
      fsm = new TypeState.FiniteStateMachine<T>(startState, allowImplicitSelfTransition);
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
  public forEach(
    callbackfn: (
      value: TypeState.FiniteStateMachine<any>,
      key: string,
      map: Map<string, TypeState.FiniteStateMachine<any>>
    ) => void,
    thisArg?: any
  ): void {
    return this.cache.forEach(callbackfn, thisArg);
  }

  /**
   * Get finite state machine from cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  public get<T>(key: string): TypeState.FiniteStateMachine<T> | void {
    return this.cache.get(key) as TypeState.FiniteStateMachine<T>;
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
  public set<T>(key: string, value: TypeState.FiniteStateMachine<T>): this {
    this.cache.set(key, value);
    return this;
  }
}
