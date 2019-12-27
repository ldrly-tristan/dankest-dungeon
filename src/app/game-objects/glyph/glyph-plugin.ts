import { GlyphData } from '../../models/entity';
import { Glyph } from './glyph';
import { GlyphConfig } from './glyph-config';
import { GlyphCreator } from './glyph-creator';
import { GlyphFactory } from './glyph-factory';

/**
 * Glyph plugin.
 */
export class GlyphPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * Plugin object item.
   */
  public static readonly pluginObjectItem: Phaser.Types.Core.PluginObjectItem = {
    key: 'GlyphPlugin',
    plugin: GlyphPlugin,
    start: true
  };

  /**
   * Instantiate glyph plugin.
   *
   * @param pluginManager Phaser plugin manager.
   */
  public constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('glyph', this.glyphFactory, this.glyphCreator);
  }

  /**
   * Glyph creator.
   *
   * @param config Game object configuration.
   * @param addToScene Add to scene flag.
   */
  protected glyphCreator: GlyphCreator = function(config: GlyphConfig, addToScene?: boolean) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectCreator;

    const { glyphData, fontFamily, fontSize } = config;
    const glyph = new Glyph(self['scene'], glyphData, fontFamily, fontSize);

    if (addToScene !== undefined) {
      config.add = addToScene;
    }

    Phaser.GameObjects.BuildGameObject(self['scene'], glyph, config);

    return glyph;
  };

  /**
   * Glyph factory.
   *
   * @param glyphData Glyph data.
   * @param fontSize Font size.
   * @param fontFamily Font family.
   */
  protected glyphFactory: GlyphFactory = function(glyphData: GlyphData, fontSize: string, fontFamily: string) {
    const self = (this as unknown) as Phaser.GameObjects.GameObjectFactory;

    const glyph = new Glyph(self['scene'], glyphData, fontSize, fontFamily);

    self['displayList'].add(glyph);
    self['updateList'].add(glyph);

    return glyph;
  };
}
