import { typestate } from 'typestate';

import { FsmPlugin } from '../../plugins/fsm';

/**
 * Finite state machine abstract scene.
 */
export abstract class FsmScene<T> extends Phaser.Scene {
  /**
   * Finite state machine plugin.
   */
  public readonly fsm: FsmPlugin;

  /**
   * Create finite state machine.
   */
  protected createFsm<T>(state: T): this {
    this.fsm.create(this.sys.settings.key, state);
    return this;
  }

  /**
   * Get finite state machine.
   */
  protected getFsm(): typestate.FiniteStateMachine<T> {
    const fsm = this.fsm.get<T>(this.sys.settings.key);

    if (!fsm) {
      throw new Error(`${this.sys.settings.key} scene finite state machine not found`);
    }

    return fsm;
  }

  /**
   * Load finite state machine.
   */
  protected abstract loadFsm(): this;
}
