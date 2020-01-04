/**
 * Entity action payload interface.
 */
export interface EntityActionPayload {
  /**
   * Active entity id.
   */
  active: string;

  /**
   * Passive entity id.
   */
  passive?: string;
}
