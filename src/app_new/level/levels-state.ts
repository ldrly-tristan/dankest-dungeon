import { EntityState } from '@datorama/akita';

import { LevelData } from './level-data';

/**
 * Levels state interface.
 */
export type LevelsState = EntityState<LevelData, string>;
