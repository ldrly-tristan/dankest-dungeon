import { AssetKey, AssetType } from '../../asset-enums';
import { EntityPositionIndex, MapCellPosition, StaticTerrainMap } from '../../lib/level';
import { generateArenaMap } from '../../lib/level/mapgen';
import { StoreKey } from '../../lib/store';
import { LevelCreaturesStore, LevelItemsStore, LevelStore, LevelTerrainStore } from '../../lib/store/level';
import { StaticTerrainDataId, StaticTerrainDataIndex, UniqueEntityDataId } from '../../models/entity';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, LevelState } from '../../models/level';
import { StoreManagerService } from '../store';

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
   * Store manager.
   */
  protected readonly storeManager = this.pluginManager.get(
    StoreManagerService.pluginObjectItem.key
  ) as StoreManagerService;

  /**
   * Level creatures store.
   */
  protected readonly levelCreaturesStore = this.storeManager.get<LevelCreaturesStore>(
    StoreKey.LevelCreatures
  ) as LevelCreaturesStore;

  /**
   * Level items store.
   */
  protected readonly levelItemsStore = this.storeManager.get<LevelItemsStore>(StoreKey.LevelItems) as LevelItemsStore;

  /**
   * Level store.
   */
  protected readonly levelStore = this.storeManager.get<LevelStore>(StoreKey.Level) as LevelStore;

  /**
   * Level terrain store.
   */
  protected readonly levelTerrainStore = this.storeManager.get<LevelTerrainStore>(
    StoreKey.LevelTerrain
  ) as LevelTerrainStore;

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
   * Persist level scene configuration.
   *
   * @param config Level scene configuration.
   */
  public persistLevelSceneConfig(config?: LevelSceneConfig): this {
    const { id, seed, width, height, map, creatures, items, terrain } = config;

    this.levelStore.update({ id, seed, width, height, map });

    this.levelCreaturesStore.set(creatures);
    this.levelItemsStore.set(items);
    this.levelTerrainStore.set(terrain);

    return this;
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

    this.placePlayer(levelSceneConfig, 4, 4)
      .populateStaticTerrainMap(levelSceneConfig, map)
      .populateEntityPositionIndex(levelSceneConfig);

    return levelSceneConfig;
  }

  /**
   * Generate level scene configuration from store.
   */
  protected generateLevelSceneConfigFromStore(): LevelSceneConfig {
    const levelCreaturesState = this.levelCreaturesStore.getValue();
    const levelItemsState = this.levelItemsStore.getValue();
    const levelTerrainState = this.levelTerrainStore.getValue();

    const levelSceneConfig: LevelSceneConfig = {
      ...this.levelStore.getValue(),
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
    return generateArenaMap(seed, width, height);
  }

  /**
   * Place player.
   *
   * @param levelSceneConfig Level scene configuration
   * @param x X-coordinate.
   * @param y Y-coordinate.
   */
  protected placePlayer(levelSceneConfig: LevelSceneConfig, x: number, y: number): this {
    const position = new MapCellPosition(x, y);

    const mapCellData = levelSceneConfig.map[position.toString()] || {};

    mapCellData.creatureId = UniqueEntityDataId.Player;

    levelSceneConfig.map[position.toString()] = mapCellData;

    return this;
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
      levelSceneConfig.staticTerrainMap.set(
        x,
        y,
        value ? staticTerrainIndex[StaticTerrainDataId.Wall].id : staticTerrainIndex[StaticTerrainDataId.Floor].id
      );
    });

    return this;
  }
}
