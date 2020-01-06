/**
 * Convert string seed to number seed.
 *
 * @param seed Seed to convert.
 */
export function convertStringSeedToNumberSeed(seed: string): number {
  const codes: number[] = [];
  const length = seed.length;

  for (let i = 0; i < length; ++i) {
    codes.push(seed.charCodeAt(i));
  }

  return codes.reduce((previous, current) => previous + current, 0);
}
