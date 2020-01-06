/**
 * Generate cellular map options interface.
 */
export interface GenerateCellularMapOptions {
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
