import { Entity } from './entity';

export interface Terrain extends Entity {
  blockMove: boolean;
  blockLight: boolean;
}
