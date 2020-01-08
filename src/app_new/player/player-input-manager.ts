import { Fsm, FsmEventType } from '../fsm';
import { GameState } from '../game-state.enum';
import { PlayerInputState } from './player-input-state.enum';

/**
 * Player input manager.
 */
export class PlayerInputManager {
  /**
   * Game state context.
   */
  private gameState: GameState;

  /**
   * Resolve. Executed prior to disabling.
   */
  private resolve = (): void => undefined;

  /**
   * Manager finite state machine.
   */
  private readonly fsm = new Fsm<PlayerInputState>({
    startState: PlayerInputState.Init, // Manager initializing.
    transitions: [
      { from: PlayerInputState.Init, to: PlayerInputState.Disabled }, // Always start disabled.
      { from: PlayerInputState.Disabled, to: PlayerInputState.Direct },
      { from: PlayerInputState.Direct, to: PlayerInputState.Disabled },
      { from: PlayerInputState.Direct, to: PlayerInputState.Modal },
      { from: PlayerInputState.Modal, to: PlayerInputState.Disabled }
    ],
    events: [
      // On enter disabled player input state event.
      {
        state: PlayerInputState.Disabled,
        type: FsmEventType.OnEnter,
        handler: (from?: PlayerInputState, data?: any): boolean => this.onEnterDisabledPlayerInputState(from, data)
      },
      // On disabled player input state event.
      {
        state: PlayerInputState.Disabled,
        type: FsmEventType.On,
        handler: (from?: PlayerInputState, data?: any): void => this.onDisabledPlayerInputState(from, data)
      },
      // On exit disabled player input state event.
      {
        state: PlayerInputState.Disabled,
        type: FsmEventType.OnExit,
        handler: (to?: PlayerInputState): boolean => this.onExitDisabledPlayerInputState(to)
      },
      // On enter direct player input state event.
      {
        state: PlayerInputState.Direct,
        type: FsmEventType.OnEnter,
        handler: (from?: PlayerInputState, data?: any): boolean => this.onEnterDirectPlayerInputState(from, data)
      },
      // On direct player input state event.
      {
        state: PlayerInputState.Direct,
        type: FsmEventType.On,
        handler: (from?: PlayerInputState, data?: any): void => this.onDirectPlayerInputState(from, data)
      },
      // On exit direct player input state event.
      {
        state: PlayerInputState.Direct,
        type: FsmEventType.OnExit,
        handler: (to?: PlayerInputState): boolean => this.onExitDirectPlayerInputState(to)
      }
    ]
  });

  /**
   * Instantiate player input manager.
   *
   * @param keyboardPlugin Keyboard plugin.
   */
  public constructor(private keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    this.disable();

    keyboardPlugin.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (keyboardEvent: KeyboardEvent) =>
      this.handleInput(keyboardEvent.key)
    );
  }

  /**
   * Enable player input handling with given game state context. Executes resolve callback prior to disabling.
   *
   * @param gameState Game state.
   * @param resolve Resolve.
   */
  public enable(gameState: GameState, resolve = (): void => undefined): void {
    this.gameState = gameState;
    this.resolve = resolve;

    this.fsm.go(PlayerInputState.Direct);
  }

  /**
   * Disable player input handling.
   */
  public disable(): void {
    this.fsm.go(PlayerInputState.Disabled);
  }

  /**
   * Handle input.
   *
   * @param key Key string.
   */
  private handleInput(key: string): void {
    switch (this.gameState) {
      case GameState.Title:
        this.handleTitleGameStateInput(key);
        break;
      default:
        throw new Error(`Invalid game state for player input: ${this.gameState}`);
    }
  }

  /**
   * Handle title game state input.
   *
   * @param key Key string.
   */
  private handleTitleGameStateInput(key: string): void {
    switch (this.fsm.currentState) {
      case PlayerInputState.Direct:
        // Any key.
        this.fsm.go(PlayerInputState.Disabled);
        break;
      default:
        throw new Error(`Invalid player input state during title game state: ${this.fsm.currentState}`);
    }
  }

  /**
   * On enter disabled player input state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onEnterDisabledPlayerInputState(from?: PlayerInputState, data?: any): boolean {
    return true;
  }

  /**
   * On disabled player input state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onDisabledPlayerInputState(from?: PlayerInputState, data?: any): void {
    this.resolve();
    this.keyboardPlugin.enabled = false;
  }

  /**
   * On exit disabled player input state event handler.
   *
   * @param to To state.
   */
  private onExitDisabledPlayerInputState(to?: PlayerInputState): boolean {
    return true;
  }

  /**
   * On enter direct player input state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onEnterDirectPlayerInputState(from?: PlayerInputState, data?: any): boolean {
    return true;
  }

  /**
   * On direct player input state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onDirectPlayerInputState(from?: PlayerInputState, data?: any): void {
    this.keyboardPlugin.enabled = true;
  }

  /**
   * On exit direct player input state event handler.
   *
   * @param to To state.
   */
  private onExitDirectPlayerInputState(to?: PlayerInputState): boolean {
    return true;
  }
}
