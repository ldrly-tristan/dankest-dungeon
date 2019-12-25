import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { PlayerService } from '../../../services/player';
import { SceneKey } from '../../scene-key.enum';
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
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<RootSceneState> = {
    startState: RootSceneState.Init,
    transitions: [
      { from: RootSceneState.Init, to: RootSceneState.Load },
      { from: RootSceneState.Init, to: RootSceneState.Create },
      { from: RootSceneState.Create, to: RootSceneState.Load },
      { from: RootSceneState.Load, to: RootSceneState.Play },
      { from: RootSceneState.Play, to: RootSceneState.Over },
      { from: RootSceneState.Over, to: RootSceneState.Load }
    ],
    events: [
      { state: RootSceneState.Load, type: FsmEventType.On, handler: (): void => this.onLoad() },
      { state: RootSceneState.Create, type: FsmEventType.On, handler: (): void => this.onCreate() },
      {
        state: RootSceneState.Play,
        type: FsmEventType.On,
        handler: (from, levelScene): void => this.onPlay(levelScene)
      },
      { state: RootSceneState.Over, type: FsmEventType.On, handler: (): void => this.onOver() }
    ]
  };

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
    this.game.events.once(RootSceneEvent.LoadFinished, levelScene => this.fsm.go(RootSceneState.Play, levelScene));

    if (this.player.getPlayerState().name) {
      this.fsm.go(RootSceneState.Load);
    } else {
      this.game.events.once(RootSceneEvent.CreateFinished, () => this.fsm.go(RootSceneState.Load));
      this.fsm.go(RootSceneState.Create);
    }
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
