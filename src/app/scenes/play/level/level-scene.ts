import { glyphFontFamily, glyphFontSize } from '../../../consts';
import { UniqueEntityDataId } from '../../../lib/entity';
import { EntityActionManager, MapCellPosition, PlayerTurnInputManager, Scheduler } from '../../../lib/level';
import { FsmConfig, FsmEventType, FsmScene } from '../../../lib/scene';
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
   * Entity action manager.
   */
  public readonly entityAction = new EntityActionManager(this);

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
   * Scheduler.
   */
  public readonly scheduler = new Scheduler();

  /**
   * Static data service.
   */
  public readonly staticData: StaticDataService;

  /**
   * Entity glyph index.
   */
  protected readonly entityGlyphIndex = new Map<string, Phaser.GameObjects.Image>();

  /**
   * Finite state machine configuration.
   */
  protected readonly fsmConfig: FsmConfig<LevelSceneState> = {
    startState: LevelSceneState.Init,
    transitions: [
      { from: LevelSceneState.Init, to: LevelSceneState.PlayerTurn },
      { from: LevelSceneState.PlayerTurn, to: LevelSceneState.ProcessNonPlayerTurns },
      { from: LevelSceneState.PlayerTurn, to: LevelSceneState.Finish },
      { from: LevelSceneState.ProcessNonPlayerTurns, to: LevelSceneState.UpdateUi },
      { from: LevelSceneState.UpdateUi, to: LevelSceneState.PlayerTurn }
    ],
    events: [
      {
        state: LevelSceneState.PlayerTurn,
        type: FsmEventType.On,
        handler: (from: LevelSceneState, endPlayerTurn: (value?: void | PromiseLike<void>) => void): void =>
          this.onPlayerTurn(endPlayerTurn)
      },
      {
        state: LevelSceneState.ProcessNonPlayerTurns,
        type: FsmEventType.On,
        handler: (from: LevelSceneState, endPlayerTurn: (value?: void | PromiseLike<void>) => void): void =>
          this.onProcessNonPlayerTurns(endPlayerTurn)
      },
      {
        state: LevelSceneState.UpdateUi,
        type: FsmEventType.On,
        handler: (from: LevelSceneState, endPlayerTurn: (value?: void | PromiseLike<void>) => void): void =>
          this.onUpdateUi(endPlayerTurn)
      },
      {
        state: LevelSceneState.Finish,
        type: FsmEventType.On,
        handler: (): void => this.onFinish()
      }
    ]
  };

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
   * Player turn input manager.
   */
  protected playerTurnInput = new PlayerTurnInputManager(this);

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

    this.createGlyphmap().createEntityGlyphs();

    this.scheduler.run((item: string, scheduler: Scheduler) => this.handleScheduledItem(item, scheduler));
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initGlyphGroups()
      .initScheduler()
      .initPlayerTurnInputManager();
  }

  /**
   * Create entity glyphs.
   */
  protected createEntityGlyphs(): this {
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
   * Create glyphmap.
   */
  protected createGlyphmap(): this {
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
        const mapCellPosition = new MapCellPosition(x, y);
        const staticTerrainData = this.level.getDefaultStaticTerrainData(mapCellPosition);

        if (!staticTerrainData) {
          throw new Error(`Static terrain data not found: ${mapCellPosition}`);
        }

        const { ch, fg, bg } = staticTerrainData.glyph;

        this.glyphmap.putGlyphAt(x, y, ch, fg, bg);
      }
    }

    return this;
  }

  /**
   * Handle scheduled item.
   *
   * @param item Item.
   * @param scheduler Scheduler.
   */
  protected handleScheduledItem(item: string, scheduler: Scheduler): Promise<void> | void {
    if (item === UniqueEntityDataId.Player) {
      switch (this.fsm.currentState) {
        case LevelSceneState.Init:
          return new Promise(endPlayerTurn => this.fsm.go(LevelSceneState.PlayerTurn, endPlayerTurn));
        case LevelSceneState.ProcessNonPlayerTurns:
          return new Promise(endPlayerTurn => this.fsm.go(LevelSceneState.UpdateUi, endPlayerTurn));
      }
    }

    /** @todo handle non player action... */
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
   * Initialize player turn input manager.
   */
  protected initPlayerTurnInputManager(): this {
    this.playerTurnInput.init();
    return this;
  }

  /**
   * Initialize scheduler.
   */
  protected initScheduler(): this {
    this.scheduler.add(UniqueEntityDataId.Player, true);
    return this;
  }

  /**
   * Finish level scene state handler.
   */
  protected onFinish(): void {
    this.scene.stop(this.sys.settings.key);
  }

  /**
   * Player turn level scene state handler.
   *
   * @param endPlayerTurn End player turn callback.
   */
  protected onPlayerTurn(endPlayerTurn: (value?: void | PromiseLike<void>) => void): void {
    console.log('Player Turn');
    this.cameras.main.startFollow(this.entityGlyphIndex.get(UniqueEntityDataId.Player));
    this.playerTurnInput.listen(() => this.fsm.go(LevelSceneState.ProcessNonPlayerTurns, endPlayerTurn));
  }

  /**
   * Process non-player turns level scene state handler.
   *
   * @param endPlayerTurn End player turn callback.
   */
  protected onProcessNonPlayerTurns(endPlayerTurn: (value?: void | PromiseLike<void>) => void): void {
    console.log('Process Non-Player Turns');
    endPlayerTurn();
  }

  /**
   * Update user interface level scene state handler.
   *
   * @param endPlayerTurn End player turn callback.
   */
  protected onUpdateUi(endPlayerTurn: (value?: void | PromiseLike<void>) => void): void {
    console.log('Update UI');
    /** @todo update ui based on queued actions & their results... */
    this.fsm.go(LevelSceneState.PlayerTurn, endPlayerTurn);
  }
}
