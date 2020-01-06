import { FsmEventConfig } from './fsm-event-config';
import { FsmTransitionConfig } from './fsm-transition-config';

/**
 * Finite state machine configuration interface.
 */
export interface FsmConfig<T> {
  /**
   * Start state.
   */
  startState: T;

  /**
   * Transitions.
   */
  transitions: FsmTransitionConfig<T>[];

  /**
   * Events.
   */
  events: FsmEventConfig<T>[];
}
