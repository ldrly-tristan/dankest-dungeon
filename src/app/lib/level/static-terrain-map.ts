import { StaticTerrainDataId } from '../entity';
import { MapCellPosition } from './map-cell-position';

/**
 * Static terrain map.
 */
export class StaticTerrainMap {
  /**
   * Map position to static terrain index.
   */
  protected map = new Map<string, number>();

  /**
   * Map static terrain id to static terrain index.
   */
  protected staticTerrainIndex = new Map<StaticTerrainDataId, number>();

  /**
   * Map static terrain index to static terrain id.
   */
  protected staticTerrainReverseIndex = new Map<number, StaticTerrainDataId>();

  /**
   * Index counter.
   */
  protected indexCounter = 1;

  /**
   * Get static terrain id at specified position.
   *
   * @param mapCellPosition Map cell position.
   */
  public get(mapCellPosition: MapCellPosition): StaticTerrainDataId | void {
    const position = mapCellPosition.toString();

    if (!this.map.has(position)) {
      return;
    }

    return this.staticTerrainReverseIndex.get(this.map.get(position));
  }

  /**
   * Set static terrain id at specified position.
   *
   * @param mapCellPosition Map cell position.
   * @param staticTerrainId Static terrain id.
   */
  public set(mapCellPosition: MapCellPosition, staticTerrainId: StaticTerrainDataId): this {
    const position = mapCellPosition.toString();

    let index = this.staticTerrainIndex.get(staticTerrainId);

    if (!index) {
      index = this.indexCounter++;
      this.staticTerrainIndex.set(staticTerrainId, index);
      this.staticTerrainReverseIndex.set(index, staticTerrainId);
    }

    this.map.set(position, index);

    return this;
  }
}
