import { FsmConfig, FsmScenePlugin } from '../../plugins/fsm';

/**
 * Finite state machine scene.
 */
export abstract class FsmScene<T> extends Phaser.Scene {
  /**
   * Finite state machine scene plugin.
   */
  public readonly fsm: FsmScenePlugin<T>;

  /**
   * Finite state machine configuration.
   */
  protected abstract readonly fsmConfig: FsmConfig<T>;
}
