import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
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
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<CreateGameSceneState> = {
    startState: CreateGameSceneState.Init,
    transitions: [
      { from: CreateGameSceneState.Init, to: CreateGameSceneState.GenerateLevel },
      { from: CreateGameSceneState.GenerateLevel, to: CreateGameSceneState.Finish }
    ],
    events: [
      { state: CreateGameSceneState.GenerateLevel, type: FsmEventType.On, handler: (): void => this.onGenerateLevel() },
      { state: CreateGameSceneState.Finish, type: FsmEventType.On, handler: (): void => this.onFinish() }
    ]
  };

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
    this.fsm.go(CreateGameSceneState.GenerateLevel);
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

    this.fsm.go(CreateGameSceneState.Finish);
  }
}
