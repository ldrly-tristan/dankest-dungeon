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
    const fsm = this.fsm.get<CreateGameSceneState>(SceneKey.CreateGame);

    if (!fsm) {
      throw new Error('Create game scene finite state machine not found');
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
    const fsm = this.fsm.create(SceneKey.CreateGame, CreateGameSceneState.Init);

    fsm.from(CreateGameSceneState.Init).to(CreateGameSceneState.Start);
    fsm.from(CreateGameSceneState.Start).to(CreateGameSceneState.GenerateLevel);

    fsm.on(CreateGameSceneState.Start, () => this.onStart());
    fsm.on(CreateGameSceneState.GenerateLevel, () => this.onGenerateLevel());

    return this;
  }

  /**
   * Generate level create game scene state handler.
   */
  protected onGenerateLevel(): void {
    console.log(CreateGameSceneState.GenerateLevel);
  }

  /**
   * Start create game scene state handler.
   */
  protected onStart(): void {
    const fsm = this.fsm.get<CreateGameSceneState>(SceneKey.CreateGame);

    if (!fsm) {
      throw new Error('Create game scene finite state machine not found');
    }

    fsm.go(CreateGameSceneState.GenerateLevel);
  }
}
