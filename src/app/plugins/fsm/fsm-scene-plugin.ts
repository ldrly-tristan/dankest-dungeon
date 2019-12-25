import { FsmManagerPlugin } from './fsm-manager-plugin';

/**
 * Finite state machine scene plugin.
 */
export class FsmScenePlugin<T> extends Phaser.Plugins.ScenePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'FsmScenePlugin',
    plugin: FsmScenePlugin,
    start: true,
    mapping: 'fsm'
  };

  /**
   * Global finite state machine plugin.
   */
  public readonly fsm = this.pluginManager.get(FsmManagerPlugin.pluginObjectItem.key) as FsmManagerPlugin;

  /**
   * Scene finite state machine.
   */
  protected readonly sceneFsm = this.fsm.create<T>(
    this.scene.sys.settings.key,
    this.scene['fsmConfig'] || { startState: undefined, transitions: [], events: [] }
  );

  /**
   * Instantiate finite state machine scene plugin.
   *
   * @param scene Scene.
   * @param pluginManager Plugin manager.
   */
  public constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super(scene, pluginManager);

    scene.events.once(Phaser.Scenes.Events.DESTROY, () => this.fsm.delete(this.scene.sys.settings.key));
  }

  /**
   * Current state.
   */
  public get currentState(): T {
    return this.sceneFsm.currentState;
  }

  /**
   * Transition to another valid state.
   *
   * @param state Target state.
   * @param event Event.
   */
  public go<U>(state: T, event?: U): void {
    return this.sceneFsm.go(state, event);
  }

  /**
   * Reset the finite state machine back to the start state, DO NOT USE THIS AS A SHORTCUT for a transition.
   * This is for starting the fsm from the beginning.
   */
  public reset(): void {
    return this.sceneFsm.reset();
  }
}
