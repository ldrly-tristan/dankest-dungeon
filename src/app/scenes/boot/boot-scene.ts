import { StorePlugin } from '../../plugins/store';
import { stores } from '../../stores';
import { SceneKey } from '../scene-key.enum';

/**
 * Boot scene.
 */
export class BootScene extends Phaser.Scene {
  /**
   * Store plugin interface.
   */
  public readonly store: StorePlugin;

  /**
   * Instantiate boot scene.
   */
  public constructor() {
    super({ key: SceneKey.Boot });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    // Stop boot scene and start load scene.
    this.scene.start(SceneKey.Load);
  }

  /**
   * Lifecycle method called before all others.
   */
  public init(): void {
    this.initStores();
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
}
