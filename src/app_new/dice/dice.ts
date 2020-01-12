import { DiceRollResult } from './dice-roll-result';

/**
 * Dice.
 */
export class Dice {
  /**
   * Dice string regular expression.
   */
  private static diceStringRegex = /^(\d+)(d|D)(\d+)((\+|-)+\d+)?$/;

  /**
   * Parse dice string into number array [numberOfDice, baseOfDice, modifier].
   *
   * @param diceString Dice string.
   */
  private static parseDiceString(diceString: string): number[] {
    const matches = diceString.match(Dice.diceStringRegex);

    if (!matches) {
      throw new Error(`Invalid dice string: ${diceString}`);
    }

    return [parseInt(matches[1]), parseInt(matches[3]), matches.length > 4 ? parseInt(matches[4]) : 0];
  }

  /**
   * Instantiate dice.
   *
   * @param rnd Random data generator.
   */
  public constructor(private rnd: Phaser.Math.RandomDataGenerator) {}

  /**
   * Roll dice.
   *
   * @param n Number of dice.
   * @param b Base of dice
   * @param m Final modifier.
   */
  public roll(n: number | string, b: number, m: number): DiceRollResult {
    if (typeof n === 'string') {
      const parsed = Dice.parseDiceString(n);

      n = parsed[0];
      b = parsed[1];
      m = parsed[2];
    }

    if (n <= 0) {
      throw new Error(`Invalid number of dice: ${n}`);
    } else if (b <= 1) {
      throw new Error(`Invalid base for dice: ${b}`);
    }

    const results: number[] = [];

    for (let i = 0; i < n; ++i) {
      results.push(this.rnd.integerInRange(1, b));
    }

    return { results, total: results.reduce((p: number, c: number) => p + c, m), modifier: m };
  }
}
