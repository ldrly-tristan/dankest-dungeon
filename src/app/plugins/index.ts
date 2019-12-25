import { FsmManagerPlugin, FsmScenePlugin } from './fsm';
import { GlyphmapPlugin } from './glyphmap';

/**
 * Global plugins.
 */
export const globalPlugins = [FsmManagerPlugin.pluginObjectItem, GlyphmapPlugin.pluginObjectItem];

/**
 * Scene plugins.
 */
export const scenePlugins = [FsmScenePlugin.pluginObjectItem];
