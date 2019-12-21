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
  protected staticTerrainIndex = new Map<string, number>();

  /**
   * Map static terrain index to static terrain id.
   */
  protected staticTerrainReverseIndex = new Map<number, string>();

  /**
   * Index counter.
   */
  protected indexCounter = 1;

  /**
   * Get static terrain id at specified position.
   *
   * @param x X-coordinate.
   * @param y Y-coordinate.
   */
  public get(x: number, y: number): string | void {
    const position = x + ',' + y;

    if (!this.map.has(position)) {
      return;
    }

    return this.staticTerrainReverseIndex.get(this.map.get(position));
  }

  /**
   * Set static terrain id at specified position.
   *
   * @param x X-coordinate.
   * @param y Y-coordinate.
   * @param staticTerrainId Static terrain id.
   */
  public set(x: number, y: number, staticTerrainId: string): this {
    const position = x + ',' + y;

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
