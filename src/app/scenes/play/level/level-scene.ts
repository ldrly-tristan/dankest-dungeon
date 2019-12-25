import { AssetKey, AssetType } from '../../../asset-enums';
import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { StaticTerrainDataIndex } from '../../../models/entity';
import { LevelSceneConfig } from '../../../models/level';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from '../../../plugins/glyphmap';
import { LevelService } from '../../../services/level';
import { LevelSceneState } from './level-scene-state.enum';

/**
 * Level scene.
 */
export class LevelScene extends FsmScene<LevelSceneState> {
  /**
   * Glyphmap aware game object factory.
   */
  public readonly add: GlyphmapAwareGameObjectFactory;

  /**
   * Level service interface.
   */
  public readonly level: LevelService;

  /**
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<LevelSceneState> = {
    startState: LevelSceneState.Init,
    transitions: [{ from: LevelSceneState.Init, to: LevelSceneState.Finish }],
    events: [
      {
        state: LevelSceneState.Finish,
        type: FsmEventType.On,
        handler: (): void => this.onFinish()
      }
    ]
  };

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
    this.level.persistLevelSceneConfig(this.config);

    const { centerX, centerY } = this.cameras.main;
    this.glyphmap.setPosition(centerX, centerY);

    //this.getFsm().go(LevelSceneState.Finish);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initGlyphmap();
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
}
