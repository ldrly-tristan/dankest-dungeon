import { AssetKey, AssetType } from '../../asset-enums';
import { EntityPositionIndex, MapCellPosition, StaticTerrainMap } from '../../lib/level';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, LevelState, StaticTerrainDataIndex } from '../../models';
import { MapgenPlugin } from '../../plugins/mapgen';
import { StorePlugin } from '../../plugins/store';
import { LevelCreaturesStore, LevelItemsStore, LevelStore, LevelTerrainStore, StoreKey } from '../../stores';

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

    const levelSceneConfig: LevelSceneConfig = {
      ...levelState,
      creatures: [],
      items: [],
      terrain: [],
      staticTerrainMap: new StaticTerrainMap(),
      entityPositionIndex: new EntityPositionIndex()
    };

    const map = this.generateMap(seed, width, height);

    this.populateStaticTerrainMap(levelSceneConfig, map).populateEntityPositionIndex(levelSceneConfig);

    return levelSceneConfig;
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

    const levelCreaturesStore = storePlugin.get<LevelCreaturesStore>(StoreKey.LevelCreatures);

    if (!levelCreaturesStore) {
      throw new Error('Level creature store not found');
    }

    const levelItemsStore = storePlugin.get<LevelItemsStore>(StoreKey.LevelItems);

    if (!levelItemsStore) {
      throw new Error('Level items store not found');
    }

    const levelTerrainStore = storePlugin.get<LevelTerrainStore>(StoreKey.LevelTerrain);

    if (!levelTerrainStore) {
      throw new Error('Level terrain store not found');
    }

    const levelCreaturesState = levelCreaturesStore.getValue();
    const levelItemsState = levelItemsStore.getValue();
    const levelTerrainState = levelTerrainStore.getValue();

    const levelSceneConfig: LevelSceneConfig = {
      ...levelStore.getValue(),
      creatures: levelCreaturesState.ids.map(id => levelCreaturesState.entities[id]),
      items: levelItemsState.ids.map(id => levelItemsState.entities[id]),
      terrain: levelTerrainState.ids.map(id => levelTerrainState.entities[id]),
      staticTerrainMap: new StaticTerrainMap(),
      entityPositionIndex: new EntityPositionIndex()
    };

    const { seed, width, height } = levelSceneConfig;

    const map = this.generateMap(seed, width, height);

    this.populateStaticTerrainMap(levelSceneConfig, map).populateEntityPositionIndex(levelSceneConfig);

    return levelSceneConfig;
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
   * Populate entity position index.
   *
   * @param levelSceneConfig Level scene configuration.
   */
  protected populateEntityPositionIndex(levelSceneConfig: LevelSceneConfig): this {
    Object.keys(levelSceneConfig.map).forEach(position => {
      const mapCellData = levelSceneConfig.map[position];

      [mapCellData.creatureId, mapCellData.terrainId]
        .concat(mapCellData.itemIds)
        .forEach(id => levelSceneConfig.entityPositionIndex.set(id, new MapCellPosition(position)));
    });

    return this;
  }

  /**
   * Populate static terrain map.
   *
   * @param levelSceneConfig Level scene configuration.
   * @param map Source map.
   */
  protected populateStaticTerrainMap(levelSceneConfig: LevelSceneConfig, map: Map<string, number>): this {
    const staticTerrainIndex = this.game.cache[AssetType.Terrain].get(AssetKey.Terrain) as StaticTerrainDataIndex;

    map.forEach((value, position) => {
      const { x, y } = new MapCellPosition(position);
      levelSceneConfig.staticTerrainMap.set(x, y, value ? staticTerrainIndex.wall.id : staticTerrainIndex.floor.id);
    });

    return this;
  }
}
