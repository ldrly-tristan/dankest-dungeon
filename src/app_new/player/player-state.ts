import { CreatureData } from '../entity';

/**
 * Player state interface.
 */
export interface PlayerState extends CreatureData {
  /**
   * Name.
   */
  name: string;
}
