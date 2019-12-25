import { TitleGlyphmap } from './title-glyphmap';
import { TitleGlyphmapCreator } from './title-glyphmap-creator';
import { TitleGlyphmapFactory } from './title-glyphmap-factory';

/**
 * Title glyphmap plugin.
 */
export class TitleGlyphmapPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'TitleGlyphmapPlugin',
    plugin: TitleGlyphmapPlugin,
    start: true
  };

  /**
   * Instantiate title glyphmap plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('titleGlyphmap', this.titleGlyphmapFactory, this.titleGlyphmapCreator);
  }

  /**
   * Title glyphmap creator.
   *
   * @param config Game object configuration.
   * @param addToScene Add to scene flag.
   */
  protected titleGlyphmapCreator: TitleGlyphmapCreator = function(
    config: Phaser.Types.GameObjects.GameObjectConfig,
    addToScene?: boolean
  ) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectCreator;

    if (config === undefined) {
      config = {};
    }

    const GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

    const x = GetAdvancedValue(config, 'x', 0);
    const y = GetAdvancedValue(config, 'y', 0);

    const titleGlyphmap = new TitleGlyphmap(self['scene'], x, y);

    if (addToScene !== undefined) {
      config.add = addToScene;
    }

    Phaser.GameObjects.BuildGameObject(self['scene'], titleGlyphmap, config);

    return titleGlyphmap;
  };

  /**
   * Title glyphmap factory.
   *
   * @param x Left most horizontal coordinate.
   * @param y Top most vertical coordinate.
   */
  protected titleGlyphmapFactory: TitleGlyphmapFactory = function(x?: number, y?: number) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectFactory;

    const titleGlyphmap = new TitleGlyphmap(self['scene'], x, y);

    self['displayList'].add(titleGlyphmap);
    self['updateList'].add(titleGlyphmap);

    return titleGlyphmap;
  };
}
