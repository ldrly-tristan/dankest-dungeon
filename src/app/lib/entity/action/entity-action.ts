import { EntityActionPayload } from '../../../models/entity';
import { EntityActionId } from './entity-action-id.enum';

/**
 * Entity action.
 */
export abstract class EntityAction<T extends EntityActionPayload> {
  /**
   * Id.
   */
  public abstract readonly id: EntityActionId;

  /**
   * Instantiate entity action.
   *
   * @param payload Payload.
   */
  public constructor(public readonly payload: T) {}
}
