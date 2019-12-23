/* eslint-disable @typescript-eslint/no-empty-interface */
import { EntityState } from '@datorama/akita';

import { ItemData } from './item-data';

/**
 * Level items state interface.
 */
export interface LevelItemsState extends EntityState<ItemData, string> {}
