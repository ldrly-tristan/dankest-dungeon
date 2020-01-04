import { EntityActionPayload } from '../../models/entity';
import { LevelScene } from '../../scenes/play/level';
import { EntityAction, EntityActionId, EntityMoveAction } from '../entity/action';

/**
 * Entity action manager.
 */
export class EntityActionManager {
  /**
   * Instantiate entity action manager.
   *
   * @param scene Scene.
   */
  public constructor(protected readonly scene: LevelScene) {}

  /**
   * Dispatch entity action.
   *
   * @param action Action.
   */
  public dispatch(action: EntityAction<EntityActionPayload>): void {
    switch (action.id) {
      case EntityActionId.Move:
        this.handleEntityMoveAction(action as EntityMoveAction);
        break;
      default:
        throw new Error(`Action not supported: ${action.id}`);
    }
  }

  /**
   * Handle entity move action.
   *
   * @param action Action.
   */
  protected handleEntityMoveAction(action: EntityMoveAction): void {
    const { active, source, destination } = action.payload;

    this.scene.level.updateEntityPosition(active, destination);
    this.scene.scheduler.setDuration(60);

    /** @todo queue ui update... */

    return;
  }
}
