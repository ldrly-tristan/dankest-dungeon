import { LevelConfig } from '../../models/instance';
import { FsmPlugin } from '../../plugins/fsm';
import { StorePlugin } from '../../plugins/store';
import { LevelService } from '../../services/level';
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
    fsm.on(LoadGameSceneState.Finish, (from, levelConfig) => this.onFinish(levelConfig));

    return this;
  }

  /**
   * Finish load game scene state handler.
   */
  protected onFinish(levelConfig: LevelConfig): void {
    this.game.events.emit(RootSceneEvent.LoadFinished, new LevelScene(levelConfig));
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

    const levelConfig = this.level.generate(true);

    fsm.go(LoadGameSceneState.Finish, levelConfig);
  }
}
