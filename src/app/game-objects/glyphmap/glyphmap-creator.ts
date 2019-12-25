import { Glyphmap } from './glyphmap';
import { GlyphmapConfig } from './glyphmap-config';

/**
 * Glyphmap creator.
 *
 * @param config Glyphmap configuration.
 * @param addToScene Add to scene flag.
 */
export type GlyphmapCreator = (config: GlyphmapConfig, addToScene?: boolean) => Glyphmap;
