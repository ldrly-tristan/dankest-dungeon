import { LevelSceneConfig } from '../../../models/level';
import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
import { FsmScene } from '../fsm-scene';
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
   * Instantiate load game scene.
   */
  public constructor() {
    super({ key: SceneKey.LoadGame });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    this.getFsm().go(LoadGameSceneState.Finish, this.level.generateLevelSceneConfig());
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.createFsm(LoadGameSceneState.Init).loadFsm();
  }

  /**
   * Load finite state machine.
   */
  protected loadFsm(): this {
    const fsm = this.fsm.create(SceneKey.LoadGame, LoadGameSceneState.Init);

    fsm.from(LoadGameSceneState.Init).to(LoadGameSceneState.Finish);

    fsm.on(LoadGameSceneState.Finish, (from, config: LevelSceneConfig) => this.onFinish(config));

    return this;
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
