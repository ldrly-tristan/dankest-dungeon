import { GlyphTexturesService } from './glyph-textures';
import { LevelService } from './level';
import { PlayerService } from './player';
import { StaticDataService } from './static-data';
import { StoreManagerService } from './store';

/**
 * Global services.
 */
export const globalServices = [
  StoreManagerService.pluginObjectItem,
  StaticDataService.pluginObjectItem,
  LevelService.pluginObjectItem,
  PlayerService.pluginObjectItem
];

export const sceneServices = [GlyphTexturesService.pluginObjectItem];
