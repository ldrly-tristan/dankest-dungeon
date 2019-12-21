import { StaticTerrainMap } from '../../lib/level';
import { Level } from './level';

export interface LevelConfig extends Level {
  staticTerrainMap: StaticTerrainMap;
}
