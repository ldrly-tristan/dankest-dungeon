import { AssetKey, AssetType } from '../../asset-enums';
import { StaticEntityDataAccessor } from '../../lib/entity';
import {
  StaticCreatureData,
  StaticCreatureDataId,
  StaticCreatureDataIndex,
  StaticEntityData,
  StaticEntityDataId,
  StaticItemData,
  StaticItemDataId,
  StaticItemDataIndex,
  StaticTerrainData,
  StaticTerrainDataId,
  StaticTerrainDataIndex
} from '../../models/entity';

/**
 * Static data service.
 */
export class StaticDataService extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'StaticDataService',
    plugin: StaticDataService,
    start: true,
    mapping: 'staticData'
  };

  /**
   * Creatures.
   */
  public readonly creatures = new StaticEntityDataAccessor<
    StaticCreatureDataId,
    StaticCreatureData,
    StaticCreatureDataIndex
  >(this.pluginManager.game.cache, AssetType.Creatures, AssetKey.Creatures);

  /**
   * Items.
   */
  public readonly items = new StaticEntityDataAccessor<StaticItemDataId, StaticItemData, StaticItemDataIndex>(
    this.pluginManager.game.cache,
    AssetType.Items,
    AssetKey.Items
  );

  /**
   * Terrain.
   */
  public readonly terrain = new StaticEntityDataAccessor<
    StaticTerrainDataId,
    StaticTerrainData,
    StaticTerrainDataIndex
  >(this.pluginManager.game.cache, AssetType.Terrain, AssetKey.Terrain);

  /**
   * Get entity.
   *
   * @param staticEntityDataId Static entity data id.
   */
  public getEntity(staticEntityDataId: StaticEntityDataId): StaticEntityData<StaticEntityDataId> | void {
    return (
      this.creatures.get(staticEntityDataId) ||
      this.items.get(staticEntityDataId) ||
      this.terrain.get(staticEntityDataId)
    );
  }
}
