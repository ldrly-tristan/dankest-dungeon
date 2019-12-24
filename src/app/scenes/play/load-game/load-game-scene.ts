import { typestate } from 'typestate';

import { LevelSceneConfig } from '../../../models/level';
import { FsmPlugin } from '../../../plugins/fsm';
import { StorePlugin } from '../../../plugins/store';
import { LevelService } from '../../../services/level';
import { SceneKey } from '../../scene-key.enum';
import { LevelScene } from '../level';
import { RootSceneEvent } from '../root';
import { LoadGameSceneState } from './load-game-scene-state.enum';

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
    this.getFsm().go(LoadGameSceneState.Start);
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
  protected getFsm(): typestate.FiniteStateMachine<LoadGameSceneState> {
    const fsm = this.fsm.get<LoadGameSceneState>(SceneKey.LoadGame);

    if (!fsm) {
      throw new Error('Load game scene finite state machine not found');
    }

    return fsm;
  }

  /**
   * Initialize finite state machine.
   */
  protected initFsm(): this {
    const fsm = this.fsm.create(SceneKey.LoadGame, LoadGameSceneState.Init);

    fsm.from(LoadGameSceneState.Init).to(LoadGameSceneState.Start);
    fsm.from(LoadGameSceneState.Start).to(LoadGameSceneState.Finish);

    fsm.on(LoadGameSceneState.Start, () => this.onStart());
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

  /**
   * Start load game scene state handler.
   */
  protected onStart(): void {
    this.getFsm().go(LoadGameSceneState.Finish, this.level.generateLevelSceneConfig());
  }
}
