import { StaticTerrainDataId, UniqueEntityDataId } from '../../models/entity';
import { LevelSceneConfig, LevelSceneConfigGeneratorConfig, LevelState } from '../../models/level';
import { LevelService } from '../../services/level';
import { StaticDataService } from '../../services/static-data';
import { EntityPositionIndex } from './entity-position-index';
import { MapCellPosition } from './map-cell-position';
import { generateArenaMap } from './mapgen';
import { StaticTerrainMap } from './static-terrain-map';

/**
 * Level scene configuration generator.
 */
export class LevelSceneConfigGenerator {
  /**
   * Instantiate level scene configuration generator.
   *
   * @param level Level service.
   * @param staticData Static data service.
   */
  public constructor(protected readonly level: LevelService, protected readonly staticData: StaticDataService) {}

  /**
   * Generate level scene configuration from configuration.
   *
   * @param config Level scene configuration generator configration.
   */
  public generateLevelSceneConfigFromConfig(config: LevelSceneConfigGeneratorConfig): LevelSceneConfig {
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
  public generateLevelSceneConfigFromStore(): LevelSceneConfig {
    const { id, seed, width, height, map, creatures, items, terrain } = this.level;

    const levelSceneConfig: LevelSceneConfig = {
      id,
      seed,
      width,
      height,
      map,
      creatures,
      items,
      terrain,
      staticTerrainMap: new StaticTerrainMap(),
      entityPositionIndex: new EntityPositionIndex()
    };

    this.populateStaticTerrainMap(levelSceneConfig, this.generateMap(seed, width, height)).populateEntityPositionIndex(
      levelSceneConfig
    );

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
    map.forEach((value, position) => {
      const { x, y } = new MapCellPosition(position);

      const wallStaticData = this.staticData.terrain.get(StaticTerrainDataId.Wall);
      const floorStaticData = this.staticData.terrain.get(StaticTerrainDataId.Floor);

      if (!wallStaticData) {
        throw new Error('Wall static data not found');
      } else if (!floorStaticData) {
        throw new Error('Floor static data not found');
      }

      levelSceneConfig.staticTerrainMap.set(x, y, value ? wallStaticData.id : floorStaticData.id);
    });

    return this;
  }
}
