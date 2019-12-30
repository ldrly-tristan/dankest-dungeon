import { LevelSceneConfigGenerator } from '../../lib/level';
import { StoreKey } from '../../lib/store';
import { LevelCreaturesStore, LevelItemsStore, LevelStore, LevelTerrainStore } from '../../lib/store/level';
import {
  CreatureData,
  CreatureDataCollection,
  EntityData,
  EntityDataCollection,
  ItemData,
  ItemDataCollection,
  TerrainData,
  TerrainDataCollection
} from '../../models/entity';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, MapData } from '../../models/level';
import { StaticDataService } from '../static-data';
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
   * Level scene configuration generator.
   */
  protected readonly levelSceneConfigGenerator = new LevelSceneConfigGenerator(
    this,
    this.pluginManager.get(StaticDataService.pluginObjectItem.key) as StaticDataService
  );

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
   * Get creatures.
   */
  public get creatures(): CreatureDataCollection {
    const levelCreaturesState = this.levelCreaturesStore.getValue();

    return levelCreaturesState.ids.map(id => levelCreaturesState.entities[id]);
  }

  /**
   * Get entities.
   */
  public get entities(): EntityDataCollection {
    return [].concat(this.creatures, this.items, this.terrain);
  }

  /**
   * Get height.
   */
  public get height(): number {
    return this.levelStore.getValue().height;
  }

  /**
   * Get id.
   */
  public get id(): string {
    return this.levelStore.getValue().id;
  }

  /**
   * Get items.
   */
  public get items(): ItemDataCollection {
    const levelItemsState = this.levelItemsStore.getValue();

    return levelItemsState.ids.map(id => levelItemsState.entities[id]);
  }

  /**
   * Get map.
   */
  public get map(): MapData {
    return this.levelStore.getValue().map;
  }

  /**
   * Get seed.
   */
  public get seed(): string {
    return this.levelStore.getValue().seed;
  }

  /**
   * Get terrain.
   */
  public get terrain(): TerrainDataCollection {
    const levelTerrainState = this.levelTerrainStore.getValue();

    return levelTerrainState.ids.map(id => levelTerrainState.entities[id]);
  }

  /**
   * Get width.
   */
  public get width(): number {
    return this.levelStore.getValue().width;
  }

  /**
   * Generate level scene config.
   *
   * @param config Level scene configuration generator configuration.
   */
  public generateLevelSceneConfig(config?: LevelSceneConfigGeneratorConfig): LevelSceneConfig {
    return config
      ? this.levelSceneConfigGenerator.generateLevelSceneConfigFromConfig(config)
      : this.levelSceneConfigGenerator.generateLevelSceneConfigFromStore();
  }

  /**
   * Get creature.
   *
   * @param id Creature id.
   */
  public getCreature(id: string): CreatureData | void {
    return this.levelCreaturesStore.getValue().entities[id];
  }

  /**
   * Get entity.
   *
   * @param id Entity id.
   */
  public getEntity(id: string): EntityData | void {
    return this.getCreature(id) || this.getItem(id) || this.getTerrain(id);
  }

  /**
   * Get item.
   *
   * @param id Item id.
   */
  public getItem(id: string): ItemData | void {
    return this.levelItemsStore.getValue().entities[id];
  }

  /**
   * Get terrain.
   *
   * @param id Terrain id.
   */
  public getTerrain(id: string): TerrainData | void {
    return this.levelTerrainStore.getValue().entities[id];
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
}
