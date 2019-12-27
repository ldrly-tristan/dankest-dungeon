import { GlyphData } from '../../models/entity';

/**
 * Glyph.
 */
export class Glyph extends Phaser.GameObjects.Text {
  /**
   * Metrics cache.
   */
  protected static readonly metricsCache = new Map<string, Phaser.Types.GameObjects.Text.TextMetrics>();

  /**
   * Generate text metrics key.
   *
   * @param fontSize Font size.
   * @param fontFamily Font family.
   */
  protected static generateTextMetricsKey(fontSize: string, fontFamily: string): string {
    return `${fontSize}-${fontFamily}`;
  }

  /**
   * Instantiate glyph.
   *
   * @param scene Scene.
   * @param glyphData Glyph data.
   * @param fontSize Font size.
   * @param fontFamily Font family.
   */
  public constructor(scene: Phaser.Scene, glyphData: GlyphData, fontSize: string, fontFamily: string) {
    const textMetricsKey = Glyph.generateTextMetricsKey(fontSize, fontFamily);

    super(scene, 0, 0, glyphData.ch, {
      fontFamily,
      fontSize,
      backgroundColor: glyphData.bg,
      color: glyphData.fg,
      metrics: Glyph.metricsCache.get(textMetricsKey) || undefined
    });

    if (!Glyph.metricsCache.has(textMetricsKey)) {
      Glyph.metricsCache.set(textMetricsKey, this.getTextMetrics() as Phaser.Types.GameObjects.Text.TextMetrics);
    }
  }
}
