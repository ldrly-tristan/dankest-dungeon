import { typestate } from 'typestate';

import { FsmPlugin } from '../../../plugins/fsm';
import { StorePlugin } from '../../../plugins/store';
import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
import { RootSceneEvent } from '../root';
import { CreateGameSceneState } from './create-game-scene-state.enum';

/**
 * Create game scene.
 */
export class CreateGameScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: FsmPlugin;

  /**
   * Store plugin interface.
   */
  public readonly store: StorePlugin;

  /**
   * Level service interface.
   */
  public readonly level: LevelService;

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
    this.getFsm().go(CreateGameSceneState.Start);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initFsm();
  }

  /**
   * Get finite state machine.
   */
  protected getFsm(): typestate.FiniteStateMachine<CreateGameSceneState> {
    const fsm = this.fsm.get<CreateGameSceneState>(SceneKey.CreateGame);

    if (!fsm) {
      throw new Error('Create game scene finite state machine not found');
    }

    return fsm;
  }

  /**
   * Initialize finite state machine.
   */
  protected initFsm(): this {
    const fsm = this.fsm.create(SceneKey.CreateGame, CreateGameSceneState.Init);

    fsm.from(CreateGameSceneState.Init).to(CreateGameSceneState.Start);
    fsm.from(CreateGameSceneState.Start).to(CreateGameSceneState.GenerateLevel);
    fsm.from(CreateGameSceneState.GenerateLevel).to(CreateGameSceneState.Finish);

    fsm.on(CreateGameSceneState.Start, () => this.onStart());
    fsm.on(CreateGameSceneState.GenerateLevel, () => this.onGenerateLevel());
    fsm.on(CreateGameSceneState.Finish, () => this.onFinish());

    return this;
  }

  /**
   * Finish create game scene state handler
   */
  protected onFinish(): void {
    this.game.events.emit(RootSceneEvent.CreateFinished);
    this.scene.stop(SceneKey.CreateGame);
  }

  /**
   * Generate level create game scene state handler.
   */
  protected onGenerateLevel(): void {
    const levelSceneConfig = this.level.generateLevelSceneConfig({ id: 'test', seed: 'test', width: 10, height: 10 });

    this.level.persistLevelSceneConfig(levelSceneConfig);

    this.getFsm().go(CreateGameSceneState.Finish);
  }

  /**
   * Start create game scene state handler.
   */
  protected onStart(): void {
    this.getFsm().go(CreateGameSceneState.GenerateLevel);
  }
}
