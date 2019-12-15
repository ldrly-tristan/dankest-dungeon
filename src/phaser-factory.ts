/**
 * Custom Phaser namespace.
 */

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/phaser/types/phaser.d.ts" />

declare const PLUGIN_CAMERA3D;
declare const PLUGIN_FBINSTANT;
declare const FEATURE_SOUND;

import 'phaser/src/polyfills';

import * as CONST from 'phaser/src/const';
import * as Extend from 'phaser/src/utils/object/Extend';

/**
 * Phaser namespace factory.
 */
export async function phaserFactory(): Promise<typeof Phaser> {
  let Phaser = {
    Actions: (await import(/* webpackChunkName: "phaser-actions" */ 'phaser/src/actions')).default,
    Animations: (await import(/* webpackChunkName: "phaser-animations" */ 'phaser/src/animations')).default,
    Cache: (await import(/* webpackChunkName: "phaser-cache" */ 'phaser/src/cache')).default,
    Cameras: (await import(/* webpackChunkName: "phaser-cameras" */ 'phaser/src/cameras')).default,
    Core: (await import(/* webpackChunkName: "phaser-core" */ 'phaser/src/core')).default,
    Class: (await import(/* webpackChunkName: "phaser-class" */ 'phaser/src/utils/Class')).default,
    Create: (await import(/* webpackChunkName: "phaser-create" */ 'phaser/src/create')).default,
    Curves: (await import(/* webpackChunkName: "phaser-curves" */ 'phaser/src/curves')).default,
    Data: (await import(/* webpackChunkName: "phaser-data" */ 'phaser/src/data')).default,
    Display: (await import(/* webpackChunkName: "phaser-display" */ 'phaser/src/display')).default,
    DOM: (await import(/* webpackChunkName: "phaser-dom" */ 'phaser/src/dom')).default,
    Events: (await import(/* webpackChunkName: "phaser-events" */ 'phaser/src/events')).default,
    FacebookInstantGamesPlugin: typeof PLUGIN_FBINSTANT
      ? (
          await import(
            /* webpackChunkName: "phaser-facebook" */ 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin'
          )
        ).default
      : undefined,
    Game: (await import(/* webpackChunkName: "phaser-game" */ 'phaser/src/core/Game')).default,
    GameObjects: (await import(/* webpackChunkName: "phaser-gameobjects" */ 'phaser/src/gameobjects')).default,
    Geom: (await import(/* webpackChunkName: "phaser-geom" */ 'phaser/src/geom')).default,
    Input: (await import(/* webpackChunkName: "phaser-input" */ 'phaser/src/input')).default,
    Loader: (await import(/* webpackChunkName: "phaser-loader" */ 'phaser/src/loader')).default,
    Math: (await import(/* webpackChunkName: "phaser-math" */ 'phaser/src/math')).default,
    Physics: (await import(/* webpackChunkName: "phaser-physics" */ 'phaser/src/physics')).default,
    Plugins: (await import(/* webpackChunkName: "phaser-plugins" */ 'phaser/src/plugins')).default,
    Renderer: (await import(/* webpackChunkName: "phaser-renderer" */ 'phaser/src/renderer')).default,
    Scale: (await import(/* webpackChunkName: "phaser-scale" */ 'phaser/src/scale')).default,
    Scene: (await import(/* webpackChunkName: "phaser-scene" */ 'phaser/src/scene/Scene')).default,
    Scenes: (await import(/* webpackChunkName: "phaser-scenes" */ 'phaser/src/scene')).default,
    Sound: typeof FEATURE_SOUND
      ? (await import(/* webpackChunkName: "phaser-sound" */ 'phaser/src/sound')).default
      : undefined,
    Structs: (await import(/* webpackChunkName: "phaser-structs" */ 'phaser/src/structs')).default,
    Textures: (await import(/* webpackChunkName: "phaser-textures" */ 'phaser/src/textures')).default,
    Tilemaps: (await import(/* webpackChunkName: "phaser-tilemaps" */ 'phaser/src/tilemaps')).default,
    Time: (await import(/* webpackChunkName: "phaser-time" */ 'phaser/src/time')).default,
    Tweens: (await import(/* webpackChunkName: "phaser-tweens" */ 'phaser/src/tweens')).default,
    Utils: (await import(/* webpackChunkName: "phaser-utils" */ 'phaser/src/utils')).default
  };

  if (typeof PLUGIN_CAMERA3D) {
    Phaser.Cameras.Sprite3D = (
      await import(/* webpackChunkName: "phaser-cameras-sprite3d" */ 'phaser/plugins/camera3d/src')
    ).default;
    Phaser.GameObjects.Sprite3D = (
      await import(
        /* webpackChunkName: "phaser-gameobjects-sprite3d" */ 'phaser/plugins/camera3d/src/sprite3d/Sprite3D'
      )
    ).default;
    Phaser.GameObjects.Factories.Sprite3D = (
      await import(
        /* webpackChunkName: "phaser-gameobjects-factories-sprite3d" */ 'phaser/plugins/camera3d/src/sprite3d/Sprite3DFactory'
      )
    ).default;
    Phaser.GameObjects.Creators.Sprite3D = (
      await import(
        /* webpackChunkName: "phaser-gameobjects-creators-sprite3d" */ 'phaser/plugins/camera3d/src/sprite3d/Sprite3DCreator'
      )
    ).default;
  }

  Phaser = Extend(false, Phaser, CONST);

  global['Phaser'] = Phaser;

  return Phaser;
}
