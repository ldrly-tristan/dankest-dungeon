import { MapCell } from './map-cell';

export interface Level {
  id: string;
  seed: string;
  width: number;
  height: number;
  diffMap: Record<string, MapCell>;
}
