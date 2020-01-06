import { app as appConfig, cache as cacheConfig, glyph as glyphConfig, manifest } from './config';
import { Fsm, FsmEventType } from './fsm';
import { GameState } from './game-state.enum';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from './glyphmap';

/**
 * Main game scene. Orchestrates other scenes, services, & overall game state.
 */
export class Scene extends Phaser.Scene {
  /**
   * Glyphmap aware game object factory.
   */
  public readonly add: GlyphmapAwareGameObjectFactory;

  /**
   * Game finite state machine.
   */
  private readonly fsm = new Fsm<GameState>({
    startState: GameState.Init, // Phaser systems initializing, assets loading.
    transitions: [
      { from: GameState.Init, to: GameState.Title } // Always show title after initialization is complete.
    ],
    events: [
      // On enter title game state event.
      {
        state: GameState.Title,
        type: FsmEventType.OnEnter,
        handler: (from?: GameState, data?: any): boolean => this.onEnterTitleGameState(from, data)
      },
      // On title game state event.
      {
        state: GameState.Title,
        type: FsmEventType.On,
        handler: (from?: GameState, data?: any): void => this.onTitleGameState(from, data)
      },
      // On exit title game state event.
      {
        state: GameState.Title,
        type: FsmEventType.OnExit,
        handler: (to?: GameState): boolean => this.onExitTitleGameState(to)
      }
    ]
  });

  /**
   * Title glyphmap.
   */
  private titleGlyphmap: Glyphmap;

  /**
   * Instantiate scene as active.
   */
  public constructor() {
    super({
      key: 'Main',
      active: true,
      pack: { key: manifest.key, url: manifest.url, dataKey: manifest.defaultDataKey }
    });
  }

  /**
   * Initialize scene; called after scene start event.
   */
  public init(): void {
    return;
  }

  /**
   * Load assets; called after init().
   */
  public preload(): void {
    return;
  }

  /**
   * Create scene - all systems available; called after preload() has completed.
   *
   * Finite state machine will transition from its initial state.
   */
  public create(): void {
    this.fsm.go(GameState.Title);
  }

  /**
   * Called once per game step while the scene is running.
   *
   * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or
   * Date.now if using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  public update(time: number, delta: number): void {
    return;
  }

  /**
   * On enter title game state event handler. Creates title glyphmap if not already available.
   */
  private onEnterTitleGameState(from?: GameState, data?: any): boolean {
    if (!this.titleGlyphmap) {
      const { title, version, environment } = appConfig;
      const { key, type } = cacheConfig.title;

      const titleData = this.cache[type].get(key) as string[];
      const maxStringLength = titleData[0].length;

      [
        '', // Append empty line.
        title, // Append title text.
        '', // Append empty line.
        `${version}${environment !== 'production' ? ` - ${environment}` : ''}` // Append version text.
      ].forEach(s => {
        const margin = (maxStringLength - s.length) / 2;
        titleData.push(`${' '.repeat(Math.floor(margin))}${s}${' '.repeat(Math.ceil(margin))}`);
      });

      const titleGlyphmap = (this.titleGlyphmap = this.add
        .glyphmap(
          0,
          0,
          maxStringLength,
          titleData.length,
          false,
          glyphConfig.fontSize,
          1,
          0,
          false,
          glyphConfig.fontFamily,
          '',
          '#fff',
          '#000'
        )
        .setAlpha(0)); // Always fade in.

      // Draw title data.
      titleData.forEach((row, y, array) => {
        const length = row.length;

        for (let x = 0; x < length; ++x) {
          const ch = row.charAt(x);

          if (y >= array.length - 4) {
            titleGlyphmap.putGlyphAt(x, y, ch, '#20B2AA');
          } else {
            switch (ch) {
              case 'M':
                if (Phaser.Math.RND.integerInRange(0, 1)) {
                  titleGlyphmap.putGlyphAt(x, y, ch, '#228B22');
                } else {
                  titleGlyphmap.putGlyphAt(x, y, ch, '#32CD32');
                }
                break;
              default:
                titleGlyphmap.putGlyphAt(x, y, ch, '#ADFF2F');
                break;
            }
          }
        }
      });
    }

    this.titleGlyphmap.active = true;

    return true;
  }

  /**
   * On title game state event handler.
   */
  private onTitleGameState(from?: GameState, data?: any): void {
    const fadeDuration = 1500;

    if (from === GameState.Init) {
      const style = document.getElementById(appConfig.splashContainerDomId).style;

      // Fade out splash container.
      this.tweens.add({
        targets: {
          get alpha(): number {
            return parseFloat(style.opacity);
          },

          set alpha(value: number) {
            style.opacity = value.toString();
          }
        },
        alpha: 0,
        ease: 'Linear',
        duration: fadeDuration,
        yoyo: false,
        repeat: 0,
        onComplete: () => (style.display = 'none')
      });
    }

    // Fade in title glyphmap.
    this.tweens.add({
      targets: this.titleGlyphmap,
      alpha: 1,
      ease: 'Linear',
      duration: fadeDuration,
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        /** @todo listen for player keyboard input... */
        return;
      }
    });
  }

  /**
   * On exit title game state event handler.
   */
  private onExitTitleGameState(to?: GameState): boolean {
    // Fade out title glyphmap.
    this.tweens.add({
      targets: this.titleGlyphmap,
      alpha: 1,
      ease: 'Linear',
      duration: 750,
      yoyo: false,
      repeat: 0,
      onComplete: () => (this.titleGlyphmap.active = false)
    });

    return true;
  }
}