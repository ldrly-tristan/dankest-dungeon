/* eslint-disable @typescript-eslint/no-empty-interface */
import { EntityState } from '@datorama/akita';

import { CreatureData } from './creature-data';

/**
 * Level creatures state interface.
 */
export interface LevelCreaturesState extends EntityState<CreatureData, string> {}
