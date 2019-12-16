import RotRectDisplay from 'rot-js/lib/display/rect';
import { DisplayData, DisplayOptions } from 'rot-js/lib/display/types';

import { glyphmapConfigDefault } from './glyphmap-config-default';

/**
 * Glyphmap.
 */
export class Glyphmap extends Phaser.GameObjects.GameObject {
  /**
   * UUID.
   */
  public readonly uuid = Phaser.Math.RND.uuid();

  /**
   * rot-js rect display reference.
   */
  protected rotRectDisplay: RotRectDisplay;

  /**
   * Canvas texture reference.
   */
  protected canvasTexture: Phaser.Textures.CanvasTexture;

  /**
   * Image reference.
   */
  protected image: Phaser.GameObjects.Image;

  /**
   * Dirty cell flag(s).
   */
  protected dirty: boolean | { [pos: string]: boolean };

  /**
   * Instantiate glyphmap.
   *
   * @param scene Phaser scene.
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
  public constructor(
    scene: Phaser.Scene,
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
    super(scene, 'Glyphmap');

    const options = {
      width: width === undefined ? glyphmapConfigDefault.width : width,
      height: height === undefined ? glyphmapConfigDefault.height : height,
      transpose: transpose === undefined ? glyphmapConfigDefault.transpose : transpose,
      fontSize: fontSize === undefined ? glyphmapConfigDefault.fontSize : fontSize,
      spacing: spacing === undefined ? glyphmapConfigDefault.spacing : spacing,
      border: border === undefined ? glyphmapConfigDefault.border : border,
      forceSquareRatio: forceSquareRatio === undefined ? glyphmapConfigDefault.forceSquareRatio : forceSquareRatio,
      fontFamily: fontFamily === undefined ? glyphmapConfigDefault.fontFamily : fontFamily,
      fontStyle: fontStyle === undefined ? glyphmapConfigDefault.fontStyle : fontStyle,
      fg: fg === undefined ? glyphmapConfigDefault.fg : fg,
      bg: bg === undefined ? glyphmapConfigDefault.bg : bg
    };

    this.rotRectDisplay = new RotRectDisplay();
    this.rotRectDisplay.setOptions(options as DisplayOptions);

    this.canvasTexture = scene.textures.addCanvas(this.uuid, this.rotRectDisplay._ctx.canvas);

    this.image = new Phaser.GameObjects.Image(scene, x || 0, y || 0, this.uuid).setOrigin(0);

    this.setDataEnabled();
  }

  /**
   * Clear glyphmap content.
   */
  public clear(): void {
    this.data.reset();
    this.dirty = true;
  }

  /**
   * Put glyph at specified position.
   *
   * @param x X coordinate.
   * @param y Y coordinate.
   * @param ch Character
   * @param fg Forefround color.
   * @param bg Background color.
   */
  public putGlyphAt(x: number, y: number, ch: string | string[], fg: string, bg: string): DisplayData {
    if (!fg) {
      fg = this.rotRectDisplay._options.fg;
    }

    if (!bg) {
      bg = this.rotRectDisplay._options.bg;
    }

    const key = `${x},${y}`;
    const value: DisplayData = [x, y, ch, fg, bg];

    this.data.set(key, value);

    if (this.dirty === true) {
      // will already redraw everything
      return value;
    }

    if (!this.dirty) {
      // first!
      this.dirty = {};
    }

    this.dirty[key] = true;

    return value;
  }

  /**
   * Update glyphmap canvas texture.
   */
  public preUpdate(): void {
    if (!this.dirty) {
      return;
    }

    if (this.dirty === true) {
      // draw all
      this.rotRectDisplay.clear();

      // redraw cached data
      this.data.each((parent: Glyphmap, key: string, value: DisplayData) => this.draw(value, false));
    } else {
      // draw only dirty
      for (const key in this.dirty) {
        this.draw(this.data.get(key), true);
      }
    }

    this.dirty = false;

    if (this.scene.sys.renderer.type === Phaser.WEBGL) {
      this.canvasTexture.refresh();
    }
  }

  /**
   * Draw display data.
   *
   * @param data Display data.
   * @param clearBefore Clear before draw flag.
   */
  protected draw(data: DisplayData, clearBefore: boolean): void {
    if (data[4] !== this.rotRectDisplay._options.bg) {
      clearBefore = true;
    }

    this.rotRectDisplay.draw(data, clearBefore);
  }
}
