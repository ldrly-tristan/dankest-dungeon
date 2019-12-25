import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';

/**
 * Generate divided maze map.
 *
 * @param seed Seed.
 * @param width Width in cells.
 * @param height Height in cells.
 */
export function generateDividedMazeMap(seed: string, width?: number, height?: number): Map<string, number> {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

  const dividedMaze = new RotMap.DividedMaze(width, height);

  const map = new Map<string, number>();

  dividedMaze.create((x, y, contents) => {
    map.set(`${x},${y}`, contents);
  });

  return map;
}
