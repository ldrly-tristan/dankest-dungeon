/**
 * Finite state machine transition configuration interface.
 */
export interface FsmTransitionConfig<T> {
  /**
   * From state.
   */
  from: T;

  /**
   * To state.
   */
  to: T;
}
