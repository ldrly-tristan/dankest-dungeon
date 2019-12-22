import { FsmPlugin } from '../../plugins/fsm';
import { StorePlugin } from '../../plugins/store';
import { stores, StoreKey } from '../../stores';
import { SceneKey } from '../scene-key.enum';
import { LevelScene } from './level-scene';
import { RootSceneEvent } from './root-scene-event.enum';
import { RootSceneState } from './root-scene-state.enum';

/**
 * Root scene.
 */
export class RootScene extends Phaser.Scene {
  /**
   * Finite state machine plugin interface.
   */
  public readonly fsm: FsmPlugin;

  /**
   * Store plugin interface.
   */
  public readonly store: StorePlugin;

  /**
   * Instantiate root scene.
   */
  public constructor() {
    super({ key: SceneKey.Root });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    const fsm = this.fsm.get(SceneKey.Root);

    if (!fsm) {
      throw new Error('Root scene finite state machine not found');
    }

    fsm.go(RootSceneState.Start);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initFsm().initStores();
  }

  /**
   * Initialize finite state machine.
   */
  protected initFsm(): this {
    const fsm = this.fsm.create(SceneKey.Root, RootSceneState.Init);

    fsm.from(RootSceneState.Init).to(RootSceneState.Start);
    fsm.from(RootSceneState.Start).to(RootSceneState.Load);
    fsm.from(RootSceneState.Start).to(RootSceneState.Create);
    fsm.from(RootSceneState.Create).to(RootSceneState.Load);
    fsm.from(RootSceneState.Load).to(RootSceneState.Play);
    fsm.from(RootSceneState.Play).to(RootSceneState.Over);
    fsm.from(RootSceneState.Over).to(RootSceneState.Load);

    fsm.on(RootSceneState.Start, () => this.onStart());
    fsm.on(RootSceneState.Load, () => this.onLoad());
    fsm.on(RootSceneState.Create, () => this.onCreate());
    fsm.on(RootSceneState.Play, (from, levelScene) => this.onPlay(levelScene));
    fsm.on(RootSceneState.Over, () => this.onOver());

    return this;
  }

  /**
   * Initialize state stores.
   */
  protected initStores(): this {
    this.store.persistState({
      key: 'ldrly-tristan/dankest-dungeon'
    });

    this.store.register(stores.map(s => new s()));

    return this;
  }

  /**
   * Create root scene state handler.
   */
  protected onCreate(): void {
    this.scene.launch(SceneKey.CreatePlayer);
  }

  /**
   * Load root scene state handler.
   */
  protected onLoad(): void {
    this.scene.launch(SceneKey.LoadGame);
  }

  /**
   * Over root scene state handler.
   */
  protected onOver(): void {
    console.log(RootSceneState.Over);
  }

  /**
   * Play root scene state handler.
   */
  protected onPlay(levelScene: LevelScene): void {
    this.scene.add(levelScene.sys.settings.key, levelScene, false);
    this.scene.launch(levelScene.sys.settings.key);
  }

  /**
   * Start root scene state handler.
   */
  protected onStart(): void {
    const playerStore = this.store.get(StoreKey.Player);

    if (!playerStore) {
      throw new Error('Player store not found');
    }

    const fsm = this.fsm.get<RootSceneState>(SceneKey.Root);

    if (!fsm) {
      throw new Error('Root scene finite state machine not found');
    }

    this.game.events.once(RootSceneEvent.LoadFinished, levelScene => fsm.go(RootSceneState.Play, levelScene));

    const playerData = playerStore.getValue();

    if (playerData && playerData.name) {
      fsm.go(RootSceneState.Load);
    } else {
      this.game.events.once(RootSceneEvent.CreateFinished, () => fsm.go(RootSceneState.Load));
      fsm.go(RootSceneState.Create);
    }
  }
}
