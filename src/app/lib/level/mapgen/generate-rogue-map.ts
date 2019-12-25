import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';
import { GenerateRogueMapOptions } from './generate-rogue-map-options';

/**
 * Generate rogue map.
 *
 * @param seed Seed.
 * @param width Width in cells.
 * @param height Height in cells.
 * @param options Options.
 */
export function generateRogueMap(
  seed: string,
  width: number,
  height: number,
  options: GenerateRogueMapOptions
): Map<string, number> {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

  const rogue = new RotMap.Rogue(width, height, options);

  const map = new Map<string, number>();

  rogue.create((x, y, contents) => {
    map.set(`${x},${y}`, contents);
  });

  return map;
}
