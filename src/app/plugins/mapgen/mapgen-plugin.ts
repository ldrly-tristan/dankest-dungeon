import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { CellularMapgenOptions } from './cellular-mapgen-options';
import { DiggerDungeonMapgenOptions } from './digger-dungeon-mapgen-options';
import { GeneratedDungeonMap } from './generated-dungeon-map';
import { IceyMazeMapgenOptions } from './icey-maze-mapgen-options';
import { RogueMapgenOptions } from './rogue-mapgen-options';
import { UniformDungeonMapgenOptions } from './uniform-dungeon-mapgen-options';

/**
 * Map generator plugin.
 */
export class MapgenPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'MapgenPlugin',
    plugin: MapgenPlugin,
    start: true,
    mapping: 'mapgen'
  };

  /**
   * Convert string seed to number seed.
   *
   * @param seed Seed to convert.
   */
  protected static convertStringSeedToNumberSeed(seed: string): number {
    const codes: number[] = [];
    const length = seed.length;

    for (let i = 0; i < length; ++i) {
      codes.push(seed.charCodeAt(i));
    }

    return codes.reduce((previous, current) => previous + current, 0);
  }

  /**
   * Instantiate map generator plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  /**
   * Generate arena map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   */
  public arena(seed: string, width?: number, height?: number): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const arena = new RotMap.Arena(width, height);
    const map = new Map<string, number>();

    arena.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return map;
  }

  /**
   * Generate cellular map.
   *
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  public cellular(
    seed: string,
    width: number,
    height: number,
    options: CellularMapgenOptions = {}
  ): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const { born, connected, survive } = options;
    let { generations, probability } = options;

    const cellular = new RotMap.Cellular(width, height, { born, survive });

    if (probability === undefined) {
      probability = Phaser.Math.RND.realInRange(0, 1);
    }

    cellular.randomize(probability);

    if (generations === undefined || generations <= 0) {
      generations = Phaser.Math.RND.integerInRange(40, 60);
    }

    const map = new Map<string, number>();

    function createCallback(x, y, contents): void {
      map.set(`${x},${y}`, contents);
    }

    for (let i = generations - 1; i >= 0; --i) {
      cellular.create(i ? null : createCallback);
    }

    if (connected !== undefined) {
      cellular.connect(createCallback, connected);
    }

    return map;
  }

  /**
   * Generate digger dungeon map.
   *
   * @param seed RNG seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  public diggerDungeon(
    seed: string,
    width: number,
    height: number,
    options: DiggerDungeonMapgenOptions = {}
  ): GeneratedDungeonMap {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const diggerDungeon = new RotMap.Digger(width, height, options);

    const map = new Map<string, number>();

    diggerDungeon.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return {
      features: {
        corridor: diggerDungeon.getCorridors(),
        rooms: diggerDungeon.getRooms()
      },
      map
    };
  }

  /**
   * Generate divided maze map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   */
  public dividedMaze(seed: string, width?: number, height?: number): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const dividedMaze = new RotMap.DividedMaze(width, height);

    const map = new Map<string, number>();

    dividedMaze.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return map;
  }

  /**
   * Generate Eller maze map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   */
  public ellerMaze(seed: string, width?: number, height?: number): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const ellerMaze = new RotMap.EllerMaze(width, height);

    const map = new Map<string, number>();

    ellerMaze.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return map;
  }

  /**
   * Generate Icey maze map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  public iceyMaze(seed: string, width: number, height: number, options: IceyMazeMapgenOptions): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const iceyMaze = new RotMap.IceyMaze(width, height, options.regularity);

    const map = new Map<string, number>();

    iceyMaze.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return map;
  }

  /**
   * Generate rogue map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  public generateRogue(seed: string, width: number, height: number, options: RogueMapgenOptions): Map<string, number> {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const rogue = new RotMap.Rogue(width, height, options);

    const map = new Map<string, number>();

    rogue.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return map;
  }

  /**
   * Generate uniform dungeon map.
   *
   * @param seed Seed.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param options Options.
   */
  public generateUniformDungeon(
    seed: string,
    width: number,
    height: number,
    options: UniformDungeonMapgenOptions
  ): GeneratedDungeonMap {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const uniformDungeon = new RotMap.Uniform(width, height, options);

    const map = new Map<string, number>();

    uniformDungeon.create((x, y, contents) => {
      map.set(`${x},${y}`, contents);
    });

    return {
      features: {
        corridor: uniformDungeon.getCorridors(),
        rooms: uniformDungeon.getRooms()
      },
      map
    };
  }
}
