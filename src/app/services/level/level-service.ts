import { StaticTerrainDataId, UniqueEntityDataId } from '../../lib/entity';
import { EntityPositionIndex, LevelSceneConfigGenerator, MapCellPosition, StaticTerrainMap } from '../../lib/level';
import { StoreKey } from '../../lib/store';
import { LevelCreaturesStore, LevelItemsStore, LevelStore, LevelTerrainStore } from '../../lib/store/level';
import {
  CreatureData,
  CreatureDataCollection,
  EntityData,
  EntityDataCollection,
  ItemData,
  ItemDataCollection,
  StaticTerrainData,
  TerrainData,
  TerrainDataCollection
} from '../../models/entity';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, MapCellData, MapData } from '../../models/level';
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
   * Static data service.
   */
  protected readonly staticData = this.pluginManager.get(StaticDataService.pluginObjectItem.key) as StaticDataService;

  /**
   * Entity position index.
   */
  protected entityPositionIndex: EntityPositionIndex;

  /**
   * Static terrain map.
   */
  protected staticTerrainMap: StaticTerrainMap;

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
   * Get player position.
   */
  public get playerPosition(): MapCellPosition | void {
    return this.entityPositionIndex.get(UniqueEntityDataId.Player);
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
   * Test if specified map cell position blocks movement.
   *
   * @param mapCellPosition Map cell position.
   */
  public blocksMove(mapCellPosition: MapCellPosition): boolean {
    return this.hasCreature(mapCellPosition) || this.terrainBlocksMove(mapCellPosition);
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
   * @param idOrMapCellPosition Creature id or a map cell position.
   */
  public getCreature(idOrMapCellPosition: string | MapCellPosition): CreatureData | void {
    if (idOrMapCellPosition instanceof MapCellPosition) {
      const mapCell = this.getMapCell(idOrMapCellPosition);

      if (!mapCell || !mapCell.creatureId) {
        return;
      }

      return this.levelCreaturesStore.getValue().entities[mapCell.creatureId];
    }

    return this.levelCreaturesStore.getValue().entities[idOrMapCellPosition];
  }

  /**
   * Get default static terrain data at specified map cell position.
   *
   * @param mapCellPosition Map cell position.
   */
  public getDefaultStaticTerrainData(mapCellPosition: MapCellPosition): StaticTerrainData | void {
    const staticTerrainDataId = this.getDefaultStaticTerrainDataId(mapCellPosition);

    if (!staticTerrainDataId) {
      return;
    }

    return this.staticData.terrain.get(staticTerrainDataId);
  }

  /**
   * Get default static terrain data id for specified map cell position.
   *
   * @param mapCellPosition Map cell position.
   */
  public getDefaultStaticTerrainDataId(mapCellPosition: MapCellPosition): StaticTerrainDataId | void {
    return this.staticTerrainMap.get(mapCellPosition);
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
   * Get map cell.
   *
   * @param mapCellPosition Map cell position.
   */
  public getMapCell(mapCellPosition: MapCellPosition): MapCellData | void {
    return this.map[mapCellPosition.toString()];
  }

  /**
   * Get static terrain data for specified map cell position.
   *
   * @param mapCellPosition Map cell position.
   */
  public getStaticTerrainData(mapCellPosition: MapCellPosition): StaticTerrainData | void {
    const terrainData = this.getTerrain(mapCellPosition);

    const staticTerrainDataId = terrainData
      ? terrainData.staticEntityDataId
      : this.getDefaultStaticTerrainDataId(mapCellPosition);

    if (!staticTerrainDataId) {
      return;
    }

    return this.staticData.terrain.get(staticTerrainDataId);
  }

  /**
   * Get terrain.
   *
   * @param idOrMapCellPosition Terrain id or a map cell position.
   */
  public getTerrain(idOrMapCellPosition: string | MapCellPosition): TerrainData | void {
    if (idOrMapCellPosition instanceof MapCellPosition) {
      const mapCell = this.getMapCell(idOrMapCellPosition);

      if (!mapCell || !mapCell.terrainId) {
        return;
      }

      return this.levelTerrainStore.getValue().entities[mapCell.terrainId];
    }

    return this.levelTerrainStore.getValue().entities[idOrMapCellPosition];
  }

  /**
   * Test if specified map cell position has creature.
   *
   * @param mapCellPosition Map cell position.
   */
  public hasCreature(mapCellPosition: MapCellPosition): boolean {
    return !!this.getCreature(mapCellPosition);
  }

  /**
   * Persist level scene configuration.
   *
   * @param config Level scene configuration.
   */
  public persistLevelSceneConfig(config?: LevelSceneConfig): this {
    const { id, seed, width, height, map, creatures, items, terrain, entityPositionIndex, staticTerrainMap } = config;

    this.levelStore.update({ id, seed, width, height, map });

    this.levelCreaturesStore.set(creatures);
    this.levelItemsStore.set(items);
    this.levelTerrainStore.set(terrain);

    this.entityPositionIndex = entityPositionIndex;
    this.staticTerrainMap = staticTerrainMap;

    return this;
  }

  /**
   * Test if terrain blocks move at specified map cell position.
   *
   * @param mapCellPosition Map cell position.
   */
  public terrainBlocksMove(mapCellPosition: MapCellPosition): boolean {
    const staticTerrainData = this.getStaticTerrainData(mapCellPosition);

    return staticTerrainData && staticTerrainData.blockMove;
  }

  /**
   * Update entity position.
   *
   * @param id Id.
   * @param mapCellPosition Map cell position.
   */
  public updateEntityPosition(id: string, mapCellPosition: MapCellPosition): void {
    const currentMapCellPosition = this.entityPositionIndex.get(id);

    if (!currentMapCellPosition) {
      throw new Error(`Map cell position not found: ${id}`);
    }

    const sourceMapCellData = this.getMapCell(currentMapCellPosition);

    if (!sourceMapCellData) {
      throw new Error(`Map cell data not found: ${currentMapCellPosition}`);
    }

    const destinationMapCellData = this.getMapCell(mapCellPosition) || {};

    if (id === sourceMapCellData.creatureId) {
      sourceMapCellData.creatureId = undefined;
      destinationMapCellData.creatureId = id;
    } else if (Array.isArray(sourceMapCellData.itemIds) && sourceMapCellData.itemIds.includes(id)) {
      sourceMapCellData.itemIds.splice(sourceMapCellData.itemIds.indexOf(id), 1);

      if (!Array.isArray(destinationMapCellData.itemIds)) {
        destinationMapCellData.itemIds = [];
      }

      destinationMapCellData.itemIds.push(id);
    } else if (id === sourceMapCellData.terrainId) {
      sourceMapCellData.terrainId = undefined;
      destinationMapCellData.terrainId = id;
    } else {
      throw new Error(`Entity id not found: ${id} - ${currentMapCellPosition}`);
    }

    this.levelStore.update({
      map: {
        ...this.map,
        [currentMapCellPosition.toString()]: sourceMapCellData,
        [mapCellPosition.toString()]: destinationMapCellData
      }
    });

    currentMapCellPosition.x = mapCellPosition.x;
    currentMapCellPosition.y = mapCellPosition.y;
  }
}
