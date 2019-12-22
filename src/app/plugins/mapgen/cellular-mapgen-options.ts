/**
 * Cellular map generator options interface.
 */
export interface CellularMapgenOptions {
  /**
   * Born.
   */
  born?: number[];

  /**
   * Survive.
   */
  survive?: number[];

  /**
   * Connected.
   */
  connected?: number;

  /**
   * Generations.
   */
  generations?: number;

  /**
   * Probability.
   */
  probability?: number;
}
