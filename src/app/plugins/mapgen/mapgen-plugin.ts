import RotMap from 'rot-js/lib/map';
import { Corridor, Room } from 'rot-js/lib/map/features';
import RotRng from 'rot-js/lib/rng';

import { Mapgen } from './mapgen';

/**
 * Map generator plugin.
 */
export class MapgenPlugin extends Phaser.Plugins.BasePlugin implements Mapgen {
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
   * @param width Width in cells.
   * @param height Height in cells.
   */
  public arena(width?: number, height?: number): Map<string, number> {
    const arena = new RotMap.Arena(width, height);
    const map = new Map<string, number>();

    arena.create((x, y, contents) => {
      map.set(x + ',' + y, contents);
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
    options: {
      born?: number[];
      survive?: number[];
      connected?: number;
      generations?: number;
      probability?: number;
    } = {}
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
      map.set(x + ',' + y, contents);
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
  public digger(
    seed: string,
    width: number,
    height: number,
    options: {
      roomWidth?: [number, number];
      roomHeight?: [number, number];
      corridorLength?: [number, number];
      dugPercentage?: number;
      timeLimit?: number;
    } = {}
  ): { map: Map<string, number>; features: { rooms: Room[]; corridor: Corridor[] } } {
    RotRng.setSeed(MapgenPlugin.convertStringSeedToNumberSeed(seed));

    const digger = new RotMap.Digger(width, height, options);

    const map = new Map<string, number>();

    digger.create((x, y, contents) => {
      map.set(x + ',' + y, contents);
    });

    return {
      features: {
        corridor: digger.getCorridors(),
        rooms: digger.getRooms()
      },
      map
    };
  }
}
