/**
 * Level scene state enumeration.
 */
export enum LevelSceneState {
  /**
   * Init.
   */
  Init = 'Init',

  /**
   * Player turn.
   */
  PlayerTurn = 'PlayerTurn',

  /**
   * Process non-player turns.
   */
  ProcessNonPlayerTurns = 'ProcessNonPlayerTurns',

  /**
   * Update ui.
   */
  UpdateUi = 'UpdateUi',

  /**
   * Finish.
   */
  Finish = 'Finish'
}
