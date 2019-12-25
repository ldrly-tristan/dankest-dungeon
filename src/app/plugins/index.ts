import { FsmManagerPlugin, FsmScenePlugin } from './fsm';
import { GlyphmapPlugin } from './glyphmap';
import { StorePlugin } from './store';

/**
 * Global plugins.
 */
export const globalPlugins = [
  FsmManagerPlugin.pluginObjectItem,
  GlyphmapPlugin.pluginObjectItem,
  StorePlugin.pluginObjectItem
];

/**
 * Scene plugins.
 */
export const scenePlugins = [FsmScenePlugin.pluginObjectItem];
