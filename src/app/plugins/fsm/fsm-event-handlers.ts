/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * On state event handler type.
 */
export type On<T, U> = (from?: T, event?: U) => any;

/**
 * On enter state handler type.
 */
export type OnEnter<T, U> = (from?: T, event?: U) => boolean;

/**
 * On exit state handler type.
 */
export type OnExit<T> = (to?: T) => boolean;

/**
 * Finiter state machine event handler type.
 */
export type FsmEventHandler<T, U = any> = On<T, U> | OnEnter<T, U> | OnExit<T>;
