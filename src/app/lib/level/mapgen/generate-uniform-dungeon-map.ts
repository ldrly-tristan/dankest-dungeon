import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';
import { DungeonMap } from './dungeon-map';
import { GenerateUniformDungeonMapOptions } from './generate-uniform-dungeon-map-options';
/**
 * Generate uniform dungeon map.
 *
 * @param seed Seed.
 * @param width Width in cells.
 * @param height Height in cells.
 * @param options Options.
 */
export function generateUniformDungeonMap(
  seed: string,
  width: number,
  height: number,
  options: GenerateUniformDungeonMapOptions
): DungeonMap {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

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
