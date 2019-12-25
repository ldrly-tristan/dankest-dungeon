import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { LevelSceneConfig } from '../../../models/level';
import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
import { LevelScene } from '../level';
import { RootSceneEvent } from '../root';
import { LoadGameSceneState } from './load-game-scene-state.enum';

/**
 * Load game scene.
 */
export class LoadGameScene extends FsmScene<LoadGameSceneState> {
  /**
   * Level service interface.
   */
  public readonly level: LevelService;

  /**
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<LoadGameSceneState> = {
    startState: LoadGameSceneState.Init,
    transitions: [{ from: LoadGameSceneState.Init, to: LoadGameSceneState.Finish }],
    events: [
      {
        state: LoadGameSceneState.Finish,
        type: FsmEventType.On,
        handler: (from, config: LevelSceneConfig): void => this.onFinish(config)
      }
    ]
  };

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
    this.fsm.go(LoadGameSceneState.Finish, this.level.generateLevelSceneConfig());
  }

  /**
   * Finish load game scene state handler.
   *
   * @param config Level scene configuration.
   */
  protected onFinish(config: LevelSceneConfig): void {
    this.game.events.emit(RootSceneEvent.LoadFinished, new LevelScene(config));
    this.scene.stop(SceneKey.LoadGame);
  }
}
