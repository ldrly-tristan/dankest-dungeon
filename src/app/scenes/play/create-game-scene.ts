import { Fsm } from '../../plugins/fsm';
import { Store } from '../../plugins/store';
import { SceneKey } from '../scene-key.enum';
import { CreateGameSceneState } from './create-game-scene-state.enum';

/**
 * Create game scene.
 */
export class CreateGameScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: Fsm;

  /**
   * Store plugin interface.
   */
  public readonly store: Store;

  /**
   * Instantiate create game scene.
   */
  public constructor() {
    super({ key: SceneKey.CreateGame });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const fsm = this.fsm.get<CreateGameSceneState>(SceneKey.CreatePlayer);

    if (!fsm) {
      throw new Error('Create player scene finite state machine not found');
    }

    fsm.go(CreateGameSceneState.Start);
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
    const fsm = this.fsm.create(SceneKey.CreatePlayer, CreateGameSceneState.Init);

    fsm.from(CreateGameSceneState.Init).to(CreateGameSceneState.Start);

    fsm.on(CreateGameSceneState.Start, () => this.onStart());

    return this;
  }

  protected onStart(): void {
    console.log(CreateGameSceneState.Start);
  }
}
