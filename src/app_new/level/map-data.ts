import { MapCellData } from './map-cell-data';
import { PositionString } from './position-string';

/**
 * Map data type.
 */
export type MapData = Record<PositionString, MapCellData>;
