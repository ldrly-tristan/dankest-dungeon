import RotRectDisplay from 'rot-js/lib/display/rect';
import { DisplayData, DisplayOptions } from 'rot-js/lib/display/types';

import { glyphmapConfigDefault } from './glyphmap-config-default';

/**
 * Glyphmap.
 */
export class Glyphmap extends Phaser.GameObjects.Image {
  /**
   * Texture key.
   */
  public readonly textureKey = Phaser.Math.RND.uuid();

  /**
   * rot-js rect display reference.
   */
  protected rotRectDisplay: RotRectDisplay;

  /**
   * Canvas texture reference.
   */
  protected canvasTexture: Phaser.Textures.CanvasTexture;

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
    super(scene, x || 0, y || 0, undefined);

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

    this.canvasTexture = scene.textures.addCanvas(this.textureKey, this.rotRectDisplay._ctx.canvas);

    this.setTexture(this.textureKey);

    this.setDataEnabled();
  }

  /**
   * Clear glyphmap content.
   */
  public clear(): this {
    this.data.reset();
    this.data.set('dirty', true);

    return this;
  }

  /**
   * Destroys this Game Object removing it from the Display List and Update List and
   * severing all ties to parent resources.
   *
   * Also removes itself from the Input Manager and Physics Manager if previously enabled.
   *
   * Use this to remove a Game Object from your game if you don't ever plan to use it again.
   * As long as no reference to it exists within your own code it should become free for
   * garbage collection by the browser.
   *
   * If you just want to temporarily disable an object then look at using the
   * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
   *
   * @param fromScene Is this Game Object being destroyed as the result of a Scene shutdown? Default false.
   */
  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);

    this.canvasTexture.destroy();

    delete this.canvasTexture;
    delete this.rotRectDisplay;
  }

  /**
   * Update glyphmap canvas texture.
   */
  public preUpdate(): void {
    const dirty = this.data.get('dirty');

    if (!dirty) {
      return;
    }

    if (dirty === true) {
      // Redraw all cached data.
      this.rotRectDisplay.clear();
      this.data.each((parent: Glyphmap, key: string, value: DisplayData) => this.draw(value, false));
    } else {
      // Draw only dirty cells
      for (const key in dirty) {
        this.draw(this.data.get(key), true);
      }
    }

    this.data.set('dirty', false);

    if (this.scene.sys.renderer.type === Phaser.WEBGL) {
      this.canvasTexture.refresh();
    }
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
  public putGlyphAt(x: number, y: number, ch: string | string[], fg?: string, bg?: string): DisplayData {
    if (!fg) {
      fg = this.rotRectDisplay._options.fg;
    }

    if (!bg) {
      bg = this.rotRectDisplay._options.bg;
    }

    const key = `${x},${y}`;
    const value: DisplayData = [x, y, ch, fg, bg];

    this.data.set(key, value);

    let dirty = this.data.get('dirty');

    if (dirty === true) {
      // Will already redraw everything.
      return value;
    }

    if (!dirty) {
      // First!
      dirty = {};
    }

    dirty[key] = true;
    this.data.set('dirty', dirty);

    return value;
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
