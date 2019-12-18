/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeState } from 'typestate';

/**
 * Finite state machine plugin interface.
 */
export interface Fsm {
  /**
   * Clear finite state machine cache.
   */
  clear(): void;

  /**
   * Create finite state machine & add to cache.
   *
   * @param key Key that identifies the finite state machine.
   * @param startState Start state.
   * @param allowImplicitSelfTransition Allow implicit self transition flag.
   */
  create<T>(key: string, startState: T, allowImplicitSelfTransition?: boolean): TypeState.FiniteStateMachine<T>;

  /**
   * Delete a finite state machine from cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  delete(key: string): boolean;

  /**
   * Iterate the finite state machine cache.
   *
   * @param callbackfn Callback function.
   * @param thisArg Execution context.
   */
  forEach(
    callbackfn: (
      value: TypeState.FiniteStateMachine<any>,
      key: string,
      map: Map<string, TypeState.FiniteStateMachine<any>>
    ) => void,
    thisArg?: any
  ): void;

  /**
   * Get finite state machine from cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  get<T>(key: string): TypeState.FiniteStateMachine<T> | void;

  /**
   * Test for finite state machine in cache.
   *
   * @param key Key that identifies the finite state machine.
   */
  has(key: string): boolean;

  /**
   * Set finite state machine in cache.
   *
   * @param key Key that identifies the finite state machine.
   * @param value Finite state machine.
   */
  set<T>(key: string, value: TypeState.FiniteStateMachine<T>): this;
}
