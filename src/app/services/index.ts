import { LevelService } from './level';
import { PlayerService } from './player';
import { StoreManagerService } from './store';

/**
 * Global services.
 */
export const globalServices = [
  StoreManagerService.pluginObjectItem,
  LevelService.pluginObjectItem,
  PlayerService.pluginObjectItem
];
