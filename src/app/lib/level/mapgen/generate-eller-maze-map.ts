import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';

/**
 * Generate Eller maze map.
 *
 * @param seed Seed.
 * @param width Width in cells.
 * @param height Height in cells.
 */
export function generateEllerMazeMap(seed: string, width?: number, height?: number): Map<string, number> {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

  const ellerMaze = new RotMap.EllerMaze(width, height);

  const map = new Map<string, number>();

  ellerMaze.create((x, y, contents) => {
    map.set(`${x},${y}`, contents);
  });

  return map;
}
