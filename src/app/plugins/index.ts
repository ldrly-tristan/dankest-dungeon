import { FsmPlugin } from './fsm';
import { GlyphmapPlugin } from './glyphmap';
import { MapgenPlugin } from './mapgen';
import { StorePlugin } from './store';

/**
 * Global plugins.
 */
export const globalPlugins = [
  { key: 'FsmPlugin', plugin: FsmPlugin, start: true, mapping: 'fsm' },
  { key: 'GlyphmapPlugin', plugin: GlyphmapPlugin, start: true },
  { key: 'MapgenPlugin', plugin: MapgenPlugin, start: true, mapping: 'mapgen' },
  { key: 'StorePlugin', plugin: StorePlugin, start: true, mapping: 'store' }
];
