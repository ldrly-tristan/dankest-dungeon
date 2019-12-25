import RotRectDisplay from 'rot-js/lib/display/rect';

import { Glyphmap } from './glyphmap';
import { GlyphmapConfig } from './glyphmap-config';
import { GlyphmapFactory } from './glyphmap-factory';
import { GlyphmapCreator } from './glyphmap-creator';

/**
 * Glyphmap plugin.
 */
export class GlyphmapPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'GlyphmapPlugin',
    plugin: GlyphmapPlugin,
    start: true
  };

  /**
   * Instantiate glyphmap plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    RotRectDisplay.cache = true;

    pluginManager.registerGameObject('glyphmap', this.glyphmapFactory, this.glyphmapCreator);
  }

  /**
   * Glyphmap creator.
   *
   * @param config Glyphmap configuration.
   * @param addToScene Add to scene flag.
   */
  protected glyphmapCreator: GlyphmapCreator = function(config: GlyphmapConfig, addToScene?: boolean) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectCreator;

    if (config === undefined) {
      config = {};
    }

    const GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);

    const {
      width,
      height,
      transpose,
      fontSize,
      spacing,
      border,
      forceSquareRatio,
      fontFamily,
      fontStyle,
      fg,
      bg
    } = config;

    const glyphmap = new Glyphmap(
      self['scene'],
      x,
      y,
      width,
      height,
      transpose,
      fontSize,
      spacing,
      border,
      forceSquareRatio,
      fontFamily,
      fontStyle,
      fg,
      bg
    );

    if (addToScene !== undefined) {
      config.add = addToScene;
    }

    Phaser.GameObjects.BuildGameObject(self['scene'], glyphmap, config);

    return glyphmap;
  };

  /**
   * Glyphmap factory.
   *
   * @param x Left most horizontal coordinate.
   * @param y Top most vertical coordinate.
   * @param width Width in cells.
   * @param height Height in cells.
   * @param transpose Transpose.
   * @param fontSize Font size.
   * @param spacing Spacing.
   * @param border Border.
   * @param forceSquareRatio Force square ratio.
   * @param fontFamily Font family.
   * @param fontStyle Font style.
   * @param fg Foreground color.
   * @param bg Background color.
   */
  protected glyphmapFactory: GlyphmapFactory = function(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    transpose?: boolean,
    fontSize?: number,
    spacing?: number,
    border?: number,
    forceSquareRatio?: boolean,
    fontFamily?: string,
    fontStyle?: string,
    fg?: string,
    bg?: string
  ) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectFactory;

    const glyphmap = new Glyphmap(
      self['scene'],
      x,
      y,
      width,
      height,
      transpose,
      fontSize,
      spacing,
      border,
      forceSquareRatio,
      fontFamily,
      fontStyle,
      fg,
      bg
    );

    self['displayList'].add(glyphmap);
    self['updateList'].add(glyphmap);

    return glyphmap;
  };
}
