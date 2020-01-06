import { typestate } from 'typestate';

import { FsmConfig } from './fsm-config';
import { FsmEventType } from './fsm-event-type.enum';

/**
 * Finite state machine.
 */
export class Fsm<T> {
  /**
   * Finite state machine manager plugin.
   */
  protected readonly fsm = new typestate.FiniteStateMachine<T>(this.config.startState);

  /**
   * Instantiate finite state machine.
   *
   * @param config Configuration.
   */
  public constructor(protected readonly config: FsmConfig<T>) {
    config.transitions.forEach(t => this.fsm.from(t.from).to(t.to));

    config.events.forEach(e => {
      switch (e.type) {
        case FsmEventType.On:
          this.fsm.on(e.state, e.handler);
          break;
        case FsmEventType.OnEnter:
          this.fsm.onEnter(e.state, e.handler);
          break;
        case FsmEventType.OnExit:
          this.fsm.onEnter(e.state, e.handler);
          break;
      }
    });
  }

  /**
   * Get current state.
   */
  public get currentState(): T {
    return this.fsm.currentState;
  }

  /**
   * Transition to another valid state.
   *
   * @param state Target state.
   * @param data Transition data - passed to event handlers.
   */
  public go<U>(state: T, data?: U): void {
    return this.fsm.go(state, data);
  }

  /**
   * Reset the finite state machine back to the start state, DO NOT USE THIS AS A SHORTCUT for a transition.
   * This is for starting the fsm from the beginning.
   */
  public reset(): void {
    return this.fsm.reset();
  }
}
