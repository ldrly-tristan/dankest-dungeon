import { Fsm, FsmEventType } from '../../plugins/fsm';
import { LevelScene } from '../../scenes/play/level';

/**
 * Player turn input manager state enumeration.
 */
enum PlayerTurnInputManagerState {
  /**
   * Init.
   */
  Init = 'Init',

  /**
   * Direct.
   */
  Direct = 'Direct',

  /**
   * Modal.
   */
  Modal = 'Modal',

  /**
   * Disabled.
   */
  Disabled = 'Disabled'
}

/**
 * Player turn input manager.
 */
export class PlayerTurnInputManager {
  /**
   * Finite state machine.
   */
  protected readonly fsm = new Fsm({
    startState: PlayerTurnInputManagerState.Init,
    transitions: [
      { from: PlayerTurnInputManagerState.Init, to: PlayerTurnInputManagerState.Disabled },
      { from: PlayerTurnInputManagerState.Disabled, to: PlayerTurnInputManagerState.Direct },
      { from: PlayerTurnInputManagerState.Direct, to: PlayerTurnInputManagerState.Modal },
      { from: PlayerTurnInputManagerState.Direct, to: PlayerTurnInputManagerState.Disabled },
      { from: PlayerTurnInputManagerState.Modal, to: PlayerTurnInputManagerState.Direct },
      { from: PlayerTurnInputManagerState.Modal, to: PlayerTurnInputManagerState.Disabled }
    ],
    events: [
      {
        state: PlayerTurnInputManagerState.Disabled,
        type: FsmEventType.On,
        handler: (): void => this.onDisabled()
      },
      {
        state: PlayerTurnInputManagerState.Direct,
        type: FsmEventType.On,
        handler: (): void => this.onDirect()
      },
      {
        state: PlayerTurnInputManagerState.Modal,
        type: FsmEventType.On,
        handler: (): void => this.onModal()
      }
    ]
  });

  /**
   * End player turn.
   */
  protected endPlayerTurn = (): void => undefined;

  /**
   * Handling input flag.
   */
  protected isHandlingInput = false;

  /**
   * Instantiate player turn input manager.
   *
   * @param scene Scene.
   */
  public constructor(protected readonly scene: LevelScene) {}

  /**
   * Initialize player turn input manager.
   */
  public init(): this {
    this.fsm.go(PlayerTurnInputManagerState.Disabled);

    this.scene.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (keyboardEvent: KeyboardEvent) => {
      if (!this.isHandlingInput) {
        this.isHandlingInput = true;
        this.handleInput(keyboardEvent.key);
        this.isHandlingInput = false;
      }
    });

    return this;
  }

  /**
   * Listen for player input.
   *
   * @param endPlayerTurn End player turn callback.
   */
  public listen(endPlayerTurn: () => void): void {
    this.endPlayerTurn = endPlayerTurn;
    this.fsm.go(PlayerTurnInputManagerState.Direct);
  }

  /**
   * Handle direct input.
   *
   * @param key Key string.
   */
  protected handleDirectInput(key: string): void {
    switch (key) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'End':
      case 'Home':
      case 'PageDown':
      case 'PageUp':
      case ' ':
        this.handleMoveInput(key);
        break;
    }
  }

  /**
   * Handle input.
   *
   * @param key Key string.
   */
  protected handleInput(key: string): void {
    switch (this.fsm.currentState) {
      case PlayerTurnInputManagerState.Direct:
        this.handleDirectInput(key);
        break;
      case PlayerTurnInputManagerState.Modal:
        this.handleModalInput(key);
        break;
      default:
        throw new Error(`Handle input with invalid state: ${this.fsm.currentState}`);
    }
  }

  /**
   * Handle modal input.
   *
   * @param key Key string.
   */
  protected handleModalInput(key: string): void {
    return;
  }

  /**
   * Handle move input.
   *
   * @param key Key string.
   */
  protected handleMoveInput(key: string): void {
    const delta = new Phaser.Math.Vector2();

    switch (key) {
      case 'ArrowDown':
        delta.set(0, 1);
        break;
      case 'ArrowLeft':
        delta.set(-1, 0);
        break;
      case 'ArrowRight':
        delta.set(1, 0);
        break;
      case 'ArrowUp':
        delta.set(0, -1);
        break;
      case 'End':
        delta.set(-1, 1);
        break;
      case 'Home':
        delta.set(-1, -1);
        break;
      case 'PageDown':
        delta.set(1, 1);
        break;
      case 'PageUp':
        delta.set(1, -1);
        break;
      case ' ':
        break;
    }

    const playerMapCellPosition = this.scene.playerPosition;

    if (!playerMapCellPosition) {
      throw new Error('Player map cell position not found');
    }

    if (key === ' ' || !this.scene.blocksMove(playerMapCellPosition.x + delta.x, playerMapCellPosition.y + delta.y)) {
      /** @todo update level state... */
      /** @todo queue ui update... */
      console.log('Move OK');
      this.fsm.go(PlayerTurnInputManagerState.Disabled);
      this.endPlayerTurn();
    }
  }

  /**
   * Direct player turn input manager state handler.
   */
  protected onDirect(): void {
    this.scene.input.keyboard.enabled = true;
  }

  /**
   * Disabled player turn input manager state handler.
   */
  protected onDisabled(): void {
    this.scene.input.keyboard.enabled = false;
  }

  /**
   * Modal player turn input manager state handler.
   */
  protected onModal(): void {
    return;
  }
}
