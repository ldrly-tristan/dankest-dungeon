/**
 * Game state enumeration.
 */
export enum GameState {
  /**
   * Initial state - active while Phaser systems are initializing and assets are loading.
   */
  Init = 'Init',

  /**
   * Title screen state.
   */
  Title = 'Title',

  /**
   * Decision state to either continue a game or create a new game.
   */
  NewOrContinue = 'NewOrContinue',

  /**
   * Create new game state.
   */
  New = 'New',

  /**
   * Continue current game state.
   */
  Continue = 'Continue',

  /**
   * Play game state
   */
  Play = 'Play'
}
