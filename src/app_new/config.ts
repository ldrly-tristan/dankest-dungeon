import { GlyphmapPlugin } from './glyphmap';
import { Scene } from './scene';

// From package.json via webpack.
declare const APP_TITLE: string;
declare const APP_VERSION: string;

/**
 * Application.
 */
export const app = {
  /**
   * Title
   */
  title: APP_TITLE,

  /**
   * Version.
   */
  version: APP_VERSION,

  /**
   * Environment
   */
  environment: process.env.NODE_ENV,

  /**
   * Splash container dom id.
   */
  splashContainerDomId: 'splashContainer'
};

/**
 * Glyph.
 */
export const glyph = {
  /**
   * Font family.
   */
  fontFamily: 'monospace',

  /**
   * Font size.
   */
  fontSize: 32
};

/**
 * Manifest.
 */
export const manifest = {
  /**
   * Key.
   */
  key: 'manifest',

  /**
   * Url.
   */
  url: 'assets/manifest.json',

  /**
   * Default data key.
   */
  defaultDataKey: 'core'
};

/**
 * Cache.
 */
export const cache = {
  /**
   * Creatures.
   */
  creatures: {
    key: 'creatures',
    type: 'json'
  },

  /**
   * Items.
   */
  items: {
    key: 'items',
    type: 'json'
  },

  /**
   * Terrain.
   */
  terrain: {
    key: 'terrain',
    type: 'json'
  },

  /**
   * Title.
   */
  title: {
    key: 'title',
    type: 'json'
  }
};

/**
 * Scene.
 */
export const scene = Scene;

/**
 * Phaser plugins.
 */
export const plugins = {
  /**
   * Global plugins.
   */
  global: [GlyphmapPlugin.pluginObjectItem],

  /**
   * Scene plugins.
   */
  scene: []
};

/**
 * Storage.
 */
export const storage = {
  /**
   * Storage key.
   */
  key: 'ldrly-tristan/dankest-dungeon'
};
