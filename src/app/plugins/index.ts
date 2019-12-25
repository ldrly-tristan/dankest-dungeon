import { FsmManagerPlugin, FsmScenePlugin } from './fsm';
import { GlyphmapPlugin } from './glyphmap';
import { MapgenPlugin } from './mapgen';
import { StorePlugin } from './store';

/**
 * Global plugins.
 */
export const globalPlugins = [
  FsmManagerPlugin.pluginObjectItem,
  GlyphmapPlugin.pluginObjectItem,
  MapgenPlugin.pluginObjectItem,
  StorePlugin.pluginObjectItem
];

/**
 * Scene plugins.
 */
export const scenePlugins = [FsmScenePlugin.pluginObjectItem];
