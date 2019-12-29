import { glyphFontFamily, glyphFontSize } from '../../../consts';
import { MapCellPosition } from '../../../lib/level';
import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { UniqueEntityDataId } from '../../../models/entity';
import { LevelSceneConfig } from '../../../models/level';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from '../../../game-objects/glyphmap';
import { GlyphTexturesService } from '../../../services/glyph-textures';
import { LevelService } from '../../../services/level';
import { PlayerService } from '../../../services/player';
import { StaticDataService } from '../../../services/static-data';
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
   * Glyph textures service.
   */
  public readonly glyphTextures: GlyphTexturesService;

  /**
   * Level service.
   */
  public readonly level: LevelService;

  /**
   * Player service.
   */
  public readonly player: PlayerService;

  /**
   * Static data service.
   */
  public readonly staticData: StaticDataService;

  /**
   * Entity glyph index.
   */
  protected readonly entityGlyphIndex = new Map<string, Phaser.GameObjects.Image>();

  /**
   * Entity position index.
   */
  protected readonly entityPositionIndex = this.config.entityPositionIndex;

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
   * Static terrain map.
   */
  protected readonly staticTerrainMap = this.config.staticTerrainMap;

  /**
   * Creatures glyph group.
   */
  protected creaturesGlyphGroup: Phaser.GameObjects.Group;

  /**
   * Glyphmap.
   */
  protected glyphmap: Glyphmap;

  /**
   * Items glyph group.
   */
  protected itemsGlyphGroup: Phaser.GameObjects.Group;

  /**
   * Terrain glyph group.
   */
  protected terrainGlyphGroup: Phaser.GameObjects.Group;

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

    this.cameras.main.startFollow(this.entityGlyphIndex.get(UniqueEntityDataId.Player));

    //this.getFsm().go(LevelSceneState.Finish);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initGlyphmap()
      .initGlyphGroups()
      .initEntityGlyphs();
  }

  /**
   * Initialize entity glyphs.
   */
  protected initEntityGlyphs(): this {
    Object.entries(this.level.map).forEach(data => {
      const mapCellPosition = new MapCellPosition(data[0]);
      const mapCell = data[1];

      const { x, y } = this.glyphmap.getPixelCoordinates(mapCellPosition.x, mapCellPosition.y);
      const { creatureId, itemIds, terrainId } = mapCell;

      [
        { type: 'creatures', ids: creatureId ? [creatureId] : [] },
        { type: 'items', ids: itemIds ? itemIds : [] },
        { type: 'terrain', ids: terrainId ? [terrainId] : [] }
      ].forEach(config => {
        config.ids.forEach(id => {
          const entity = id === UniqueEntityDataId.Player ? this.player.getPlayerState() : this.level.getEntity(id);

          if (!entity) {
            throw new Error(`Entity not found: ${id}`);
          }

          const entityStaticData = this.staticData.getEntity(entity.staticEntityDataId);

          if (!entityStaticData) {
            throw new Error(`Static entity data not found: ${entity.staticEntityDataId}`);
          }

          this.entityGlyphIndex.set(
            id,
            this[`${config.type}GlyphGroup`].create(x, y, this.glyphTextures.get(entityStaticData.glyph).key)
          );
        });
      });
    });

    return this;
  }

  /**
   * Initialize glyph groups.
   */
  protected initGlyphGroups(): this {
    const classType = Phaser.GameObjects.Image;

    [
      { type: 'creatures', config: { 'setDepth.value': 3 } },
      { type: 'items', config: { 'setDepth.value': 2 } },
      { type: 'terrain', config: { 'setDepth.value': 1 } }
    ].forEach(config => {
      const name = `${config.type}GlyphGroup`;

      this[name] = this.add.group(undefined, {
        classType,
        name,
        ...config.config
      });
    });

    return this;
  }

  /**
   * Initialize glyphmap.
   */
  protected initGlyphmap(): this {
    const { width, height } = this.config;

    this.glyphmap = this.add.glyphmap(
      0,
      0,
      width,
      height,
      false,
      glyphFontSize,
      1,
      0,
      false,
      glyphFontFamily,
      '',
      '#fff',
      '#000'
    );

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        const staticTerrainId = this.staticTerrainMap.get(x, y);

        if (staticTerrainId) {
          const { ch, fg, bg } = this.staticData.terrain.get(staticTerrainId).glyph;

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
