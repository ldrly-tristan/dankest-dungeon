import { AssetKey, AssetType } from '../../asset-enums';
import { MapCellPosition, StaticTerrainMap } from '../../lib/level';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, LevelState, StaticTerrainDataIndex } from '../../models';
import { MapgenPlugin } from '../../plugins/mapgen';
import { StorePlugin } from '../../plugins/store';
import { StoreKey, LevelStore } from '../../stores';

/**
 * Level service.
 */
export class LevelService extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'LevelService',
    plugin: LevelService,
    start: true,
    mapping: 'level'
  };

  /**
   * Instantiate level service.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  /**
   * Generate level scene config.
   *
   * @param config Level scene configuration generator configuration.
   */
  public generateLevelSceneConfig(config?: LevelSceneConfigGeneratorConfig): LevelSceneConfig {
    return config ? this.generateLevelSceneConfigFromConfig(config) : this.generateLevelSceneConfigFromStore();
  }

  /**
   * Generate level scene configuration from configuration.
   *
   * @param config Level scene configuration generator configration.
   */
  protected generateLevelSceneConfigFromConfig(config: LevelSceneConfigGeneratorConfig): LevelSceneConfig {
    const { id, seed, width, height } = config;

    const levelState: LevelState = { id, seed, width, height, map: {} };

    const map = this.generateMap(seed, width, height);
    const staticTerrainMap = this.generateStaticTerrainMap(map);

    return { ...levelState, staticTerrainMap };
  }

  /**
   * Generate level scene configuration from store.
   */
  protected generateLevelSceneConfigFromStore(): LevelSceneConfig {
    const storePlugin = this.pluginManager.get(StorePlugin.pluginObjectItem.key) as StorePlugin;

    if (!storePlugin) {
      throw new Error('Store plugin not found');
    }

    const levelStore = storePlugin.get<LevelStore>(StoreKey.Level);

    if (!levelStore) {
      throw new Error('Level store not found');
    }

    const levelState = levelStore.getValue();

    const { seed, width, height } = levelState;
    const map = this.generateMap(seed, width, height);
    const staticTerrainMap = this.generateStaticTerrainMap(map);

    return { ...levelState, staticTerrainMap };
  }

  /**
   * Generate map.
   */
  protected generateMap(seed: string, width: number, height: number): Map<string, number> {
    const mapgenPlugin = this.pluginManager.get(MapgenPlugin.pluginObjectItem.key) as MapgenPlugin;

    if (!mapgenPlugin) {
      throw new Error('Mapgen plugin not found');
    }

    return mapgenPlugin.arena(seed, width, height);
  }

  /**
   * Generate static terrain map.
   *
   * @param map Map.
   */
  protected generateStaticTerrainMap(map: Map<string, number>): StaticTerrainMap {
    const staticTerrainIndex = this.game.cache[AssetType.Terrain].get(AssetKey.Terrain) as StaticTerrainDataIndex;

    const staticTerrainMap = new StaticTerrainMap();

    map.forEach((value, position) => {
      const { x, y } = new MapCellPosition(position);
      staticTerrainMap.set(x, y, value ? staticTerrainIndex.wall.id : staticTerrainIndex.floor.id);
    });

    return staticTerrainMap;
  }
}
