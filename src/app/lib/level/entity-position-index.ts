import { MapCellPosition } from './map-cell-position';

/**
 * Entity position index.
 */
export class EntityPositionIndex {
  /**
   * Index.
   */
  protected index = new Map<string, MapCellPosition>();

  /**
   * Get position of entity with specified id.
   *
   * @param id Entity id.
   */
  public get(id: string): MapCellPosition | void {
    return this.index.get(id);
  }

  /**
   * Set position of entity with specified id.
   *
   * @param id Entity id.
   * @param position Map cell position.
   */
  public set(id: string, position: MapCellPosition): this {
    this.index.set(id, position);
    return this;
  }
}
