import { MapCell } from './map-cell';

export interface Level {
  id: string;
  seed: string;
  diffMap: Record<string, MapCell>;
}
