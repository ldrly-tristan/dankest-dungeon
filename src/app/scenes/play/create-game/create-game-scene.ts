import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
import { FsmScene } from '../fsm-scene';
import { RootSceneEvent } from '../root';
import { CreateGameSceneState } from './create-game-scene-state.enum';

/**
 * Create game scene.
 */
export class CreateGameScene extends FsmScene<CreateGameSceneState> {
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
    this.getFsm().go(CreateGameSceneState.GenerateLevel);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.createFsm(CreateGameSceneState.Init).loadFsm();
  }

  /**
   * Load finite state machine.
   */
  protected loadFsm(): this {
    const fsm = this.getFsm();

    fsm.from(CreateGameSceneState.Init).to(CreateGameSceneState.GenerateLevel);
    fsm.from(CreateGameSceneState.GenerateLevel).to(CreateGameSceneState.Finish);

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
}
