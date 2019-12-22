import { FsmPlugin } from './fsm';
import { GlyphmapPlugin } from './glyphmap';
import { MapgenPlugin } from './mapgen';
import { StorePlugin } from './store';

/**
 * Global plugins.
 */
export const globalPlugins = [
  FsmPlugin.pluginObjectItem,
  GlyphmapPlugin.pluginObjectItem,
  MapgenPlugin.pluginObjectItem,
  StorePlugin.pluginObjectItem
];
