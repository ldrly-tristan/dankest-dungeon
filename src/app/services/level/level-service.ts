import { AssetKey, AssetType } from '../../asset-enums';
import { StaticTerrainMap } from '../../lib/level';
import { Level as LevelState, LevelConfig } from '../../models/instance';
import { Terrain as StaticTerrain } from '../../models/static';
import { MapgenPlugin } from '../../plugins/mapgen';
import { StorePlugin } from '../../plugins/store';
import { StoreKey, LevelStore } from '../../stores';

/**
 * Level service interface.
 */
export interface LevelService {
  /**
   * Generate level.
   *
   * @param fromStore Generate level from store data.
   */
  generate(fromStore?: boolean): LevelConfig;
}

/**
 * Level service.
 */
export class LevelService extends Phaser.Plugins.BasePlugin implements LevelService {
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
   * Generate level.
   *
   * @param fromStore Generate level from store data.
   */
  public generate(fromStore?: boolean): LevelConfig {
    const storePlugin = this.pluginManager.get(StorePlugin.pluginObjectItem.key) as StorePlugin;

    const levelStore = storePlugin.get<LevelStore>(StoreKey.Level);

    if (!levelStore) {
      throw new Error('Level store not found');
    }

    let levelState: LevelState;

    if (fromStore) {
      levelState = JSON.parse(JSON.stringify(levelStore.getValue()));
    }

    if (!fromStore || !levelState.id) {
      levelState = LevelStore.createInitialState();

      levelState.id = Phaser.Math.RND.uuid();
      levelState.seed = Phaser.Math.RND.integer().toString();

      levelState.width = 10;
      levelState.height = 10;
    }

    const mapgenPlugin = this.pluginManager.get(MapgenPlugin.pluginObjectItem.key) as MapgenPlugin;

    const map = mapgenPlugin.arena(levelState.width, levelState.height);

    const staticTerrainIndex = this.game.cache[AssetType.Terrain].get(AssetKey.Terrain) as Record<
      string,
      StaticTerrain
    >;

    const staticTerrainMap = new StaticTerrainMap();

    map.forEach((value, position) => {
      const [x, y] = position.split(',').map(v => parseInt(v));
      staticTerrainMap.set(x, y, value ? staticTerrainIndex.wall.id : staticTerrainIndex.floor.id);
    });

    return { ...levelState, staticTerrainMap };
  }
}
