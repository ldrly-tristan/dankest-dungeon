import { Fsm } from '../../plugins/fsm';
import { Store } from '../../plugins/store';
import { SceneKey } from '../scene-key.enum';
import { LevelScene } from './level-scene';
import { LoadGameSceneState } from './load-game-scene-state.enum';
import { RootSceneEvent } from './root-scene-event.enum';

/**
 * Load game scene.
 */
export class LoadGameScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: Fsm;

  /**
   * Store plugin interface.
   */
  public readonly store: Store;

  /**
   * Instantiate load game scene.
   */
  public constructor() {
    super({ key: SceneKey.LoadGame });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const fsm = this.fsm.get<LoadGameSceneState>(SceneKey.LoadGame);

    if (!fsm) {
      throw new Error('Load game scene finite state machine not found');
    }

    fsm.go(LoadGameSceneState.Start);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initFsm();
  }

  /**
   * Initialize finite state machine.
   */
  protected initFsm(): this {
    const fsm = this.fsm.create(SceneKey.LoadGame, LoadGameSceneState.Init);

    fsm.from(LoadGameSceneState.Init).to(LoadGameSceneState.Start);
    fsm.from(LoadGameSceneState.Start).to(LoadGameSceneState.Finish);

    fsm.on(LoadGameSceneState.Start, () => this.onStart());
    fsm.on(LoadGameSceneState.Finish, () => this.onFinish());

    return this;
  }

  /**
   * Finish load game scene state handler.
   */
  protected onFinish(): void {
    this.game.events.emit(RootSceneEvent.LoadFinished, new LevelScene('test'));
    this.scene.stop(SceneKey.LoadGame);
  }

  /**
   * Start load game scene state handler.
   */
  protected onStart(): void {
    const fsm = this.fsm.get<LoadGameSceneState>(SceneKey.LoadGame);

    if (!fsm) {
      throw new Error('Load game scene finite state machine not found');
    }

    fsm.go(LoadGameSceneState.Finish);
  }
}
