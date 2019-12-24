import { FsmPlugin } from '../../../plugins/fsm';
import { StorePlugin } from '../../../plugins/store';
import { StoreKey } from '../../../stores';
import { PlayerStore } from '../../../stores/player';
import { SceneKey } from '../../scene-key.enum';
import { CreatePlayerSceneState } from './create-player-scene-state.enum';

/**
 * Create player scene.
 */
export class CreatePlayerScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: FsmPlugin;

  /**
   * Store plugin interface.
   */
  public readonly store: StorePlugin;

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
    const fsm = this.fsm.get<CreatePlayerSceneState>(SceneKey.CreatePlayer);

    if (!fsm) {
      throw new Error('Create player scene finite state machine not found');
    }

    fsm.go(CreatePlayerSceneState.Start);
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
    const fsm = this.fsm.create(SceneKey.CreatePlayer, CreatePlayerSceneState.Init);

    fsm.from(CreatePlayerSceneState.Init).to(CreatePlayerSceneState.Start);
    fsm.from(CreatePlayerSceneState.Start).to(CreatePlayerSceneState.Name);
    fsm.from(CreatePlayerSceneState.Name).to(CreatePlayerSceneState.Finish);

    fsm.on(CreatePlayerSceneState.Start, () => this.onStart());

    fsm.onEnter(CreatePlayerSceneState.Name, () => this.onEnterName());
    fsm.on(CreatePlayerSceneState.Name, () => this.onName());
    fsm.onExit(CreatePlayerSceneState.Name, () => this.onExitName());

    fsm.on(CreatePlayerSceneState.Finish, () => this.onFinish());

    return this;
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
      const playerStore = this.store.get<PlayerStore>(StoreKey.Player);

      if (!playerStore) {
        throw new Error('Player store not found');
      }

      playerStore.update({ name });

      const fsm = this.fsm.get<CreatePlayerSceneState>(SceneKey.CreatePlayer);

      if (!fsm) {
        throw new Error('Create player scene finite state machine not found');
      }

      fsm.go(CreatePlayerSceneState.Finish);
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

  /**
   * Start create player scene state handler.
   */
  protected onStart(): void {
    const fsm = this.fsm.get<CreatePlayerSceneState>(SceneKey.CreatePlayer);

    if (!fsm) {
      throw new Error('Create player scene finite state machine not found');
    }

    fsm.go(CreatePlayerSceneState.Name);
  }
}
