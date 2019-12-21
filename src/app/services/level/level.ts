import { LevelConfig } from 'src/app/models/instance';

/**
 * Level service interface.
 */
export interface Level {
  /**
   * Generate level.
   *
   * @param fromStore Generate level from store data.
   */
  generate(fromStore?: boolean): LevelConfig;
}
