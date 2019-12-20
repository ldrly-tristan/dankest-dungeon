import { Fsm } from '../../plugins/fsm';
import { Store } from '../../plugins/store';
import { LevelSceneState } from './level-scene-state.enum';
import { RootSceneEvent } from './root-scene-event.enum';

/**
 * Level scene.
 */
export class LevelScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: Fsm;

  /**
   * Store plugin interface.
   */
  public readonly store: Store;

  /**
   * Instantiate level scene.
   */
  public constructor(key: string) {
    super({ key });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    console.log(this);
    const fsm = this.fsm.get<LevelSceneState>(this.sys.settings.key);

    if (!fsm) {
      throw new Error('Level scene finite state machine not found');
    }

    fsm.go(LevelSceneState.Start);
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
    const fsm = this.fsm.create(this.sys.settings.key, LevelSceneState.Init);

    fsm.from(LevelSceneState.Init).to(LevelSceneState.Start);
    fsm.from(LevelSceneState.Start).to(LevelSceneState.Finish);

    fsm.on(LevelSceneState.Start, () => this.onStart());
    fsm.on(LevelSceneState.Finish, () => this.onFinish());

    return this;
  }

  /**
   * Finish level scene state handler.
   */
  protected onFinish(): void {
    this.scene.stop(this.sys.settings.key);
  }

  /**
   * Start level scene state handler.
   */
  protected onStart(): void {
    const fsm = this.fsm.get<LevelSceneState>(this.sys.settings.key);

    if (!fsm) {
      throw new Error('Level scene finite state machine not found');
    }

    fsm.go(LevelSceneState.Finish);
  }
}
