import { persistState } from '@datorama/akita';

import {
  app as appConfig,
  cache as cacheConfig,
  glyph as glyphConfig,
  manifest,
  storage as storageConfig
} from './config';
import { Fsm, FsmEventType } from './fsm';
import { GameState } from './game-state.enum';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from './glyphmap';
import { LevelsStore } from './level';
import { PlayerInputManager, PlayerStore } from './player';

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
      { from: GameState.Init, to: GameState.Title }, // Always show title after initialization is complete.
      { from: GameState.Title, to: GameState.NewOrContinue },
      { from: GameState.NewOrContinue, to: GameState.New },
      { from: GameState.NewOrContinue, to: GameState.Continue },
      { from: GameState.New, to: GameState.Play },
      { from: GameState.Continue, to: GameState.Play }
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
      },
      // On enter new or continue game state event.
      {
        state: GameState.NewOrContinue,
        type: FsmEventType.OnEnter,
        handler: (from?: GameState, data?: any): boolean => this.onEnterNewOrContinueGameState(from, data)
      },
      // On new or continue game state event.
      {
        state: GameState.NewOrContinue,
        type: FsmEventType.On,
        handler: (from?: GameState, data?: any): void => this.onNewOrContinueGameState(from, data)
      },
      // On exit new or continue game state event.
      {
        state: GameState.NewOrContinue,
        type: FsmEventType.OnExit,
        handler: (to?: GameState): boolean => this.onExitNewOrContinueGameState(to)
      },
      // On enter new game state event.
      {
        state: GameState.New,
        type: FsmEventType.OnEnter,
        handler: (from?: GameState, data?: any): boolean => this.onEnterNewGameState(from, data)
      },
      // On new game state event.
      {
        state: GameState.New,
        type: FsmEventType.On,
        handler: (from?: GameState, data?: any): void => this.onNewGameState(from, data)
      },
      // On exit new game state event.
      {
        state: GameState.New,
        type: FsmEventType.OnExit,
        handler: (to?: GameState): boolean => this.onExitNewGameState(to)
      },
      // On enter continue game state event.
      {
        state: GameState.Continue,
        type: FsmEventType.OnEnter,
        handler: (from?: GameState, data?: any): boolean => this.onEnterContinueGameState(from, data)
      },
      // On continue game state event.
      {
        state: GameState.Continue,
        type: FsmEventType.On,
        handler: (from?: GameState, data?: any): void => this.onContinueGameState(from, data)
      },
      // On exit continue game state event.
      {
        state: GameState.Continue,
        type: FsmEventType.OnExit,
        handler: (to?: GameState): boolean => this.onExitContinueGameState(to)
      }
    ]
  });

  /**
   * Storage accessor.
   */
  private readonly storage = persistState(storageConfig);

  /**
   * Player store.
   */
  private readonly playerStore = new PlayerStore();

  /**
   * Levels store.
   */
  private readonly levelsStore = new LevelsStore();

  /**
   * Player input manager.
   */
  private playerInputManager: PlayerInputManager;

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
      active: true
    });
  }

  /**
   * Initialize scene; called after scene start event.
   */
  public init(): void {
    this.initLoaderGlyphmap().initPlayerInputManager();
  }

  /**
   * Load assets; called after init().
   */
  public preload(): void {
    this.load.pack({ key: manifest.key, url: manifest.url, dataKey: manifest.defaultDataKey });
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
   * Initialize loader glyphmap.
   */
  private initLoaderGlyphmap(): this {
    const loaderGlyphmap = this.add
      .glyphmap(0, 0, 12, 1, false, glyphConfig.fontSize, 1, 0, false, glyphConfig.fontFamily, '', '#fff', '#000')
      .setScrollFactor(0) // Fix to camera.
      .setActive(false) // Keep inactive unless in use.
      .setAlpha(0); // Keep hidden unless in use.

    this.load
      .on(Phaser.Loader.Events.START, () => {
        loaderGlyphmap.setPosition(this.cameras.main.centerX, this.cameras.main.height - loaderGlyphmap.height / 2);
        const status = `[${' '.repeat(10)}]`;

        loaderGlyphmap.setActive(true).setAlpha(1);

        for (let x = 0; x < status.length; ++x) {
          loaderGlyphmap.putGlyphAt(x, 0, status.charAt(x));
        }
      })
      .on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
        loaderGlyphmap.setPosition(this.cameras.main.centerX, this.cameras.main.height - loaderGlyphmap.height / 2);
        const complete = Math.floor(10 * progress);

        const status = `[${'#'.repeat(complete)}${' '.repeat(10 - complete)}]`;

        for (let x = 0; x < status.length; ++x) {
          loaderGlyphmap.putGlyphAt(x, 0, status.charAt(x));
        }
      })
      .on(Phaser.Loader.Events.COMPLETE, () =>
        this.tweens.add({
          targets: loaderGlyphmap,
          alpha: 0,
          ease: 'Linear',
          duration: 1500,
          yoyo: false,
          repeat: 0,
          onComplete: () => (loaderGlyphmap.active = false)
        })
      );

    return this;
  }

  /**
   * Initialize player input manager.
   */
  private initPlayerInputManager(): this {
    this.playerInputManager = new PlayerInputManager(this.input.keyboard);
    return this;
  }

  /**
   * On enter title game state event handler. Creates title glyphmap if not already available.
   *
   * @param from From state.
   * @param data Data.
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
   *
   * @param from From state.
   * @param data Data.
   */
  private onTitleGameState(from?: GameState, data?: any): void {
    const fadeDuration = 1500;

    if (from === GameState.Init) {
      const style = document.getElementById(appConfig.splashContainerDomId).style;
      style.opacity = '1';

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

    this.cameras.main.startFollow(this.titleGlyphmap);

    // Fade in title glyphmap.
    this.tweens.add({
      targets: this.titleGlyphmap,
      alpha: 1,
      ease: 'Linear',
      duration: fadeDuration,
      yoyo: false,
      repeat: 0,
      onComplete: () =>
        // Enable player input, trigger transition from title screen.
        this.playerInputManager.enable(this.fsm.currentState, () => this.fsm.go(GameState.NewOrContinue))
    });
  }

  /**
   * On exit title game state event handler.
   *
   * @param to To state.
   */
  private onExitTitleGameState(to?: GameState): boolean {
    // Fade out title glyphmap.
    this.tweens.add({
      targets: this.titleGlyphmap,
      alpha: 0,
      ease: 'Linear',
      duration: 750,
      yoyo: false,
      repeat: 0,
      onComplete: () => (this.titleGlyphmap.active = false)
    });

    return true;
  }

  /**
   * On enter new or continue game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onEnterNewOrContinueGameState(from?: GameState, data?: any): boolean {
    return true;
  }

  /**
   * On new or continue game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onNewOrContinueGameState(from?: GameState, data?: any): void {
    if (Object.keys(this.playerStore.getValue()).length === 0) {
      this.fsm.go(GameState.New);
    } else {
      this.fsm.go(GameState.Continue);
    }
  }

  /**
   * On exit new or continue game state event handler.
   *
   * @param to To state.
   */
  private onExitNewOrContinueGameState(to?: GameState): boolean {
    return true;
  }

  /**
   * On enter new game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onEnterNewGameState(from?: GameState, data?: any): boolean {
    this.storage.clearStore(this.levelsStore.storeName);
    this.levelsStore.reset();

    return true;
  }

  /**
   * On new game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onNewGameState(from?: GameState, data?: any): void {
    return;
  }

  /**
   * On exit new game state event handler.
   *
   * @param to To state.
   */
  private onExitNewGameState(to?: GameState): boolean {
    return true;
  }

  /**
   * On enter continue game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onEnterContinueGameState(from?: GameState, data?: any): boolean {
    return true;
  }

  /**
   * On continue game state event handler.
   *
   * @param from From state.
   * @param data Data.
   */
  private onContinueGameState(from?: GameState, data?: any): void {
    return;
  }

  /**
   * On exit continue game state event handler.
   *
   * @param to To state.
   */
  private onExitContinueGameState(to?: GameState): boolean {
    return true;
  }
}
