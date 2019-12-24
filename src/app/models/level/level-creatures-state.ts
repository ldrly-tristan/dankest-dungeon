/* eslint-disable @typescript-eslint/no-empty-interface */
import { EntityState } from '@datorama/akita';

import { CreatureData } from '../entity';

/**
 * Level creatures state interface.
 */
export interface LevelCreaturesState extends EntityState<CreatureData, string> {}
