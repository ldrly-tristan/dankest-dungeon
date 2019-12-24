import { PlayerService } from '../../../services/player';
import { SceneKey } from '../../scene-key.enum';
import { FsmScene } from '../fsm-scene';
import { LevelScene } from '../level';
import { RootSceneEvent } from './root-scene-event.enum';
import { RootSceneState } from './root-scene-state.enum';

/**
 * Root scene.
 */
export class RootScene extends FsmScene<RootSceneState> {
  /**
   * Player service.
   */
  public readonly player: PlayerService;

  /**
   * Instantiate root scene.
   */
  public constructor() {
    super({ key: SceneKey.Root });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const fsm = this.getFsm();

    this.game.events.once(RootSceneEvent.LoadFinished, levelScene => fsm.go(RootSceneState.Play, levelScene));

    if (this.player.getPlayerState().name) {
      fsm.go(RootSceneState.Load);
    } else {
      this.game.events.once(RootSceneEvent.CreateFinished, () => fsm.go(RootSceneState.Load));
      fsm.go(RootSceneState.Create);
    }
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.createFsm(RootSceneState.Init).loadFsm();
  }

  /**
   * Load finite state machine.
   */
  protected loadFsm(): this {
    const fsm = this.getFsm();

    fsm.from(RootSceneState.Init).to(RootSceneState.Load);
    fsm.from(RootSceneState.Init).to(RootSceneState.Create);
    fsm.from(RootSceneState.Create).to(RootSceneState.Load);
    fsm.from(RootSceneState.Load).to(RootSceneState.Play);
    fsm.from(RootSceneState.Play).to(RootSceneState.Over);
    fsm.from(RootSceneState.Over).to(RootSceneState.Load);

    fsm.on(RootSceneState.Load, () => this.onLoad());
    fsm.on(RootSceneState.Create, () => this.onCreate());
    fsm.on(RootSceneState.Play, (from, levelScene) => this.onPlay(levelScene));
    fsm.on(RootSceneState.Over, () => this.onOver());

    return this;
  }

  /**
   * Create root scene state handler.
   */
  protected onCreate(): void {
    this.scene.launch(SceneKey.CreatePlayer);
  }

  /**
   * Load root scene state handler.
   */
  protected onLoad(): void {
    this.scene.launch(SceneKey.LoadGame);
  }

  /**
   * Over root scene state handler.
   */
  protected onOver(): void {
    console.log(RootSceneState.Over);
  }

  /**
   * Play root scene state handler.
   */
  protected onPlay(levelScene: LevelScene): void {
    this.scene.add(levelScene.sys.settings.key, levelScene, false);
    this.scene.launch(levelScene.sys.settings.key);
  }
}
