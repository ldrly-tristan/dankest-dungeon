import { FsmEventHandler } from './fsm-event-handlers';
import { FsmEventType } from './fsm-event-type.enum';

/**
 * Finite state machine event configuration interface.
 */
export interface FsmEventConfig<T> {
  /**
   * Event state.
   */
  state: T;

  /**
   * Event type.
   */
  type: FsmEventType;

  /**
   * Event handler.
   */
  handler: FsmEventHandler<T>;
}
