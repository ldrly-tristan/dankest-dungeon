import { GlyphPlugin } from './glyph';
import { GlyphmapPlugin } from './glyphmap';
import { TitleGlyphmapPlugin } from './title-glyphmap';

/**
 * Game object plugins.
 */
export const gameObjectPlugins = [
  GlyphPlugin.pluginObjectItem,
  GlyphmapPlugin.pluginObjectItem,
  TitleGlyphmapPlugin.pluginObjectItem
];
