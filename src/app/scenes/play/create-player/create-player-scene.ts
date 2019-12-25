import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { PlayerService } from '../../../services/player';
import { SceneKey } from '../../scene-key.enum';
import { CreatePlayerSceneState } from './create-player-scene-state.enum';

/**
 * Create player scene.
 */
export class CreatePlayerScene extends FsmScene<CreatePlayerSceneState> {
  /**
   * Player service.
   */
  public readonly player: PlayerService;

  /**
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<CreatePlayerSceneState> = {
    startState: CreatePlayerSceneState.Init,
    transitions: [
      { from: CreatePlayerSceneState.Init, to: CreatePlayerSceneState.Name },
      { from: CreatePlayerSceneState.Name, to: CreatePlayerSceneState.Finish }
    ],
    events: [
      { state: CreatePlayerSceneState.Name, type: FsmEventType.OnEnter, handler: (): boolean => this.onEnterName() },
      { state: CreatePlayerSceneState.Name, type: FsmEventType.On, handler: (): void => this.onName() },
      { state: CreatePlayerSceneState.Name, type: FsmEventType.OnExit, handler: (): boolean => this.onExitName() },
      { state: CreatePlayerSceneState.Finish, type: FsmEventType.On, handler: (): void => this.onFinish() }
    ]
  };

  /**
   * Name input.
   */
  protected nameInput: Phaser.GameObjects.DOMElement;

  /**
   * Instantiate create player scene.
   */
  public constructor() {
    super({ key: SceneKey.CreatePlayer });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    this.fsm.go(CreatePlayerSceneState.Name);
  }

  /**
   * Name input keyup handler.
   *
   * @param event Keyboard event.
   */
  protected onNameInputKeyup(event: KeyboardEvent): void {
    if (this.nameInput.visible && event.target['id'] !== 'nameInput') {
      return;
    }

    const name = event.target['value'].trim();

    if (name && (event.which === 13 || event.keyCode === 13 || event.key === 'Enter')) {
      this.player.persistPlayerState({ name });
      this.fsm.go(CreatePlayerSceneState.Finish);
    }
  }

  /**
   * Name create player scene state enter handler.
   */
  protected onEnterName(): boolean {
    if (!this.nameInput) {
      this.nameInput = this.add.dom(0, 0).createFromCache('create-player-name-input');
      this.nameInput.addListener('keyup').on('keyup', event => this.onNameInputKeyup(event));
    }

    this.nameInput.setVisible(true);

    return true;
  }

  /**
   * Name create player scene state exit handler.
   */
  protected onExitName(): boolean {
    this.nameInput.setVisible(false);
    return true;
  }

  /**
   * Finish create player scene state handler.
   */
  protected onFinish(): void {
    this.scene.start(SceneKey.CreateGame);
  }

  /**
   * Name create player scene state handler.
   */
  protected onName(): void {
    const { centerX, centerY } = this.cameras.main;
    this.nameInput.setPosition(centerX, centerY);
  }
}
