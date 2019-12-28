import { MapCellPosition } from '../../../lib/level';
import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
import { GlyphData, UniqueEntityDataId } from '../../../models/entity';
import { LevelSceneConfig } from '../../../models/level';
import { Glyphmap, GlyphmapAwareGameObjectFactory } from '../../../game-objects/glyphmap';
import { LevelService } from '../../../services/level';
import { PlayerService } from '../../../services/player';
import { StaticDataService } from '../../../services/static-data';
import { LevelSceneState } from './level-scene-state.enum';

/**
 * Level scene.
 */
export class LevelScene extends FsmScene<LevelSceneState> {
  /**
   * Glyph font family.
   */
  protected static readonly glyphFontFamily = 'monospace';

  /**
   * Glyph font size.
   */
  protected static readonly glyphFontSize = 32;

  /**
   * Glyphmap aware game object factory.
   */
  public readonly add: GlyphmapAwareGameObjectFactory;

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
   * Glyph source.
   */
  protected glyphSource: Phaser.GameObjects.Text;

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
      .initGlyphSource()
      .initGlyphGroups()
      .initEntityGlyphs();
  }

  /**
   * Get glyph texture key. Creates texture if does not exist.
   *
   * @param glyphData Glyph data.
   */
  protected getGlyphTextureKey(glyphData: GlyphData): string {
    const { ch, fg, bg } = glyphData;

    const key = `${ch}${fg}${bg}`;

    if (!this.textures.exists(key)) {
      this.glyphSource.setText(ch);
      this.glyphSource.setColor(fg);
      this.glyphSource.setBackgroundColor(bg);

      const canvas = Phaser.Display.Canvas.CanvasPool.create(
        this,
        this.glyphSource.canvas.width,
        this.glyphSource.canvas.height
      );

      canvas.getContext('2d').drawImage(this.glyphSource.canvas, 0, 0);

      this.textures.addCanvas(key, canvas);
    }

    return key;
  }

  /**
   * Initialize glyph groups.
   */
  protected initGlyphGroups(): this {
    this.creaturesGlyphGroup = this.add.group(undefined, {
      classType: Phaser.GameObjects.Image,
      name: 'creaturesGlyphGroup',
      'setDepth.value': 3
    });

    this.itemsGlyphGroup = this.add.group(undefined, {
      classType: Phaser.GameObjects.Image,
      name: 'itemsGlyphGroup',
      'setDepth.value': 2
    });

    this.terrainGlyphGroup = this.add.group(undefined, {
      classType: Phaser.GameObjects.Image,
      name: 'terrainGlyphGroup',
      'setDepth.value': 1
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
      LevelScene.glyphFontSize,
      1,
      0,
      false,
      LevelScene.glyphFontFamily,
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
   * Initialize glyph source.
   */
  protected initGlyphSource(): this {
    this.glyphSource = this.make.text(
      {
        text: '',
        style: {
          fontFamily: LevelScene.glyphFontFamily,
          fontSize: `${LevelScene.glyphFontSize}px`
        }
      },
      false
    );
    return this;
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

      if (creatureId) {
        const creature =
          creatureId === UniqueEntityDataId.Player ? this.player.getPlayerState() : this.level.getCreature(creatureId);

        if (!creature) {
          throw new Error('Creature not found');
        }

        const creatureStaticData = this.staticData.creatures.get(creature.staticDataId);

        this.entityGlyphIndex.set(
          creatureId,
          this.creaturesGlyphGroup.create(x, y, this.getGlyphTextureKey(creatureStaticData.glyph))
        );
      }

      if (itemIds) {
        itemIds.forEach(itemId => {
          const item = this.level.getItem(itemId);

          if (!item) {
            throw new Error('Item not found');
          }

          const itemStaticData = this.staticData.items.get(item.staticDataId);

          this.entityGlyphIndex.set(
            itemId,
            this.itemsGlyphGroup.create(x, y, this.getGlyphTextureKey(itemStaticData.glyph))
          );
        });
      }

      if (terrainId) {
        const terrain = this.level.getTerrain(terrainId);

        if (!terrain) {
          throw new Error('Terrain not found');
        }

        const terrainStaticData = this.staticData.terrain.get(terrain.staticDataId);

        this.entityGlyphIndex.set(
          terrainId,
          this.terrainGlyphGroup.create(x, y, this.getGlyphTextureKey(terrainStaticData.glyph))
        );
      }
    });

    return this;
  }

  /**
   * Finish level scene state handler.
   */
  protected onFinish(): void {
    this.scene.stop(this.sys.settings.key);
  }
}
