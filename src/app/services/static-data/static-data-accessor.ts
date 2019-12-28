import { AssetKey, AssetType } from '../../asset-enums';
import { StaticEntityDataId } from '../../models/entity';
import { StaticEntityData } from '../../models/entity/static-entity-data';

/**
 * Static entity data accessor.
 */
export class StaticEntityDataAccessor<T, U extends StaticEntityData<T>, V> {
  /**
   * Instantiate static entity data accessor.
   *
   * @param cache Cache manager.
   * @param assetType Asset type.
   * @param assetKey Asset key.
   */
  public constructor(
    protected readonly cache: Phaser.Cache.CacheManager,
    protected readonly assetType: AssetType,
    protected readonly assetKey: AssetKey
  ) {}

  /**
   * Get static data index.
   */
  public get index(): V {
    return this.cache[this.assetType].get(this.assetKey);
  }

  /**
   * Get static entity data.
   *
   * @param staticEntityDataId Static entity data id.
   */
  public get(staticEntityDataId: StaticEntityDataId): U {
    return this.index[staticEntityDataId];
  }
}
