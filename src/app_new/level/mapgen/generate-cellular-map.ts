import RotMap from 'rot-js/lib/map';
import RotRng from 'rot-js/lib/rng';

import { convertStringSeedToNumberSeed } from './convert-string-seed-to-number-seed';
import { GenerateCellularMapOptions } from './generate-cellular-map-options';

/**
 * Generate cellular map.
 *
 * @param width Width in cells.
 * @param height Height in cells.
 * @param options Options.
 */
export function generateCellularMap(
  seed: string,
  width: number,
  height: number,
  options: GenerateCellularMapOptions = {}
): Map<string, number> {
  RotRng.setSeed(convertStringSeedToNumberSeed(seed));

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
