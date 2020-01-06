import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';
import { DungeonMap } from './dungeon-map';
import { GenerateDiggerDungeonMapOptions } from './generate-digger-dungeon-map-options';

/**
 * Generate digger dungeon map.
 *
 * @param seed RNG seed.
 * @param width Width in cells.
 * @param height Height in cells.
 * @param options Options.
 */
export function generateDiggerDungeonMap(
  seed: string,
  width: number,
  height: number,
  options: GenerateDiggerDungeonMapOptions = {}
): DungeonMap {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

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
