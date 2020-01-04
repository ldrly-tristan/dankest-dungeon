import { EntityMoveActionPayload } from '../../../models/entity';
import { EntityAction } from './entity-action';
import { EntityActionId } from './entity-action-id.enum';

/**
 * Entity move action.
 */
export class EntityMoveAction extends EntityAction<EntityMoveActionPayload> {
  /**
   * Id.
   */
  public readonly id = EntityActionId.Move;
}
