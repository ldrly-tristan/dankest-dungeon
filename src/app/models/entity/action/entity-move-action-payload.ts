import { MapCellPosition } from '../../../lib/level';
import { EntityActionPayload } from '../entity-action-payload';

/**
 * Entity move action payload interface.
 */
export interface EntityMoveActionPayload extends EntityActionPayload {
  /**
   * Destination.
   */
  destination: MapCellPosition;

  /**
   * Source.
   */
  source: MapCellPosition;
}
