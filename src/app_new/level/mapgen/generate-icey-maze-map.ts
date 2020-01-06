import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';
import { GenerateIceyMazeMapOptions } from './generate-icey-maze-map-options';

/**
 * Generate Icey maze map.
 *
 * @param seed Seed.
 * @param width Width in cells.
 * @param height Height in cells.
 * @param options Options.
 */
export function generateIceyMazeMap(
  seed: string,
  width: number,
  height: number,
  options: GenerateIceyMazeMapOptions
): Map<string, number> {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

  const iceyMaze = new RotMap.IceyMaze(width, height, options.regularity);

  const map = new Map<string, number>();

  iceyMaze.create((x, y, contents) => {
    map.set(`${x},${y}`, contents);
  });

  return map;
}
