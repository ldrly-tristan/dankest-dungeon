import { CreatureData } from './creature-data';

/**
 * Player data.
 */
export interface PlayerData extends CreatureData {
  /**
   * Name.
   */
  name: string;
}
