import { AssetKey, AssetType } from '../../asset-enums';
import { LevelSceneConfig, StaticTerrainDataIndex } from '../../models';
import { FsmPlugin } from '../../plugins/fsm';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from '../../plugins/glyphmap';
import { StorePlugin } from '../../plugins/store';
import { LevelService } from '../../services/level';
import { LevelSceneState } from './level-scene-state.enum';
import { RootSceneEvent } from './root-scene-event.enum';

/**
 * Level scene.
 */
export class LevelScene extends Phaser.Scene {
  /**
   * Glyphmap aware game object factory.
   */
  public readonly add: GlyphmapAwareGameObjectFactory;

  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: FsmPlugin;

  /**
   * Level service interface.
   */
  public readonly level: LevelService;

  /**
   * Store plugin interface.
   */
  public readonly store: StorePlugin;

  /**
   * Glyphmap.
   */
  protected glyphmap: Glyphmap;

  /**
   * Instantiate level scene.
   *
   * @param config Level scene configuration.
   */
  public constructor(protected readonly config: LevelSceneConfig) {
    super({ key: config.id });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const fsm = this.fsm.get<LevelSceneState>(this.sys.settings.key);

    if (!fsm) {
      throw new Error('Level scene finite state machine not found');
    }

    fsm.go(LevelSceneState.Start);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initFsm().initGlyphmap();
  }

  /**
   * Initialize finite state machine.
   */
  protected initFsm(): this {
    const fsm = this.fsm.create(this.sys.settings.key, LevelSceneState.Init);

    fsm.from(LevelSceneState.Init).to(LevelSceneState.Start);
    fsm.from(LevelSceneState.Start).to(LevelSceneState.Finish);

    fsm.on(LevelSceneState.Start, () => this.onStart());
    fsm.on(LevelSceneState.Finish, () => this.onFinish());

    return this;
  }

  /**
   * Initialize glyphmap.
   */
  protected initGlyphmap(): this {
    const { width, height } = this.config;

    this.glyphmap = this.add.glyphmap(0, 0, width, height);

    const staticTerrainIndex = this.game.cache[AssetType.Terrain].get(AssetKey.Terrain) as StaticTerrainDataIndex;

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        const staticTerrainId = this.config.staticTerrainMap.get(x, y);

        if (staticTerrainId) {
          const { ch, fg, bg } = staticTerrainIndex[staticTerrainId].glyph;

          this.glyphmap.putGlyphAt(x, y, ch, fg, bg);
        }
      }
    }

    return this;
  }

  /**
   * Finish level scene state handler.
   */
  protected onFinish(): void {
    this.scene.stop(this.sys.settings.key);
  }

  /**
   * Start level scene state handler.
   */
  protected onStart(): void {
    const fsm = this.fsm.get<LevelSceneState>(this.sys.settings.key);

    if (!fsm) {
      throw new Error('Level scene finite state machine not found');
    }

    this.level.persistLevelSceneConfig(this.config);

    const { centerX, centerY } = this.cameras.main;
    this.glyphmap.setPosition(centerX, centerY);

    //fsm.go(LevelSceneState.Finish);
  }
}
