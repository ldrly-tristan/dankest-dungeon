import { AssetKey, AssetType, AssetUrl } from '../../asset-enums';
import {
  StaticCreatureDataCollection,
  StaticCreatureDataIndex,
  StaticItemDataCollection,
  StaticItemDataIndex,
  StaticTerrainDataCollection,
  StaticTerrainDataIndex
} from '../../models/entity';
import { SceneKey } from '../scene-key.enum';

/**
 * Load scene.
 */
export class LoadScene extends Phaser.Scene {
  /**
   * Instantiate load scene.
   */
  public constructor() {
    super({ key: SceneKey.Load });
  }

  /**
   * Lifecycle method called after init & preload.
   */
  public create(): void {
    this.createCreaturesCache()
      .createItemsCache()
      .createTerrainCache()
      .transitionToTitleScene();
  }

  /**
   * Lifecycle method called after init & before create.
   */
  public preload(): void {
    this.load.pack(AssetKey.Manifest, AssetUrl.Manifest);
  }

  /**
   * Create creatures cache.
   */
  protected createCreaturesCache(): this {
    const creaturesCache = this.cache[AssetType.Creatures] as Phaser.Cache.BaseCache;
    const creatures = creaturesCache.get(AssetKey.Creatures) as StaticCreatureDataCollection;

    const staticCreaturesIndex: StaticCreatureDataIndex = {};
    creatures.forEach(c => (staticCreaturesIndex[c.id] = c));

    creaturesCache.add(AssetKey.Creatures, staticCreaturesIndex);

    return this;
  }

  /**
   * Create items cache.
   */
  protected createItemsCache(): this {
    const itemsCache = this.cache[AssetType.Items] as Phaser.Cache.BaseCache;
    const items = itemsCache.get(AssetKey.Items) as StaticItemDataCollection;

    const staticItemsIndex: StaticItemDataIndex = {};
    items.forEach(i => (staticItemsIndex[i.id] = i));

    itemsCache.add(AssetKey.Items, staticItemsIndex);

    return this;
  }

  /**
   * Create terrain cache.
   */
  protected createTerrainCache(): this {
    const terrainCache = this.cache[AssetType.Terrain] as Phaser.Cache.BaseCache;
    const terrain = terrainCache.get(AssetKey.Terrain) as StaticTerrainDataCollection;

    const staticTerrainIndex: StaticTerrainDataIndex = {};
    terrain.forEach(t => (staticTerrainIndex[t.id] = t));

    terrainCache.add(AssetKey.Terrain, staticTerrainIndex);

    return this;
  }

  /**
   * Transition to title scene.
   */
  protected transitionToTitleScene(): void {
    this.scene.transition({
      target: SceneKey.Title,
      duration: 1500,
      sleep: false,
      allowInput: false,
      onUpdate: (progress: number) => {
        const style = document.getElementById('splashContainer').style;

        style.opacity = (1 - progress).toString();

        if (progress === 1) {
          style.display = 'none';
          style.opacity = '1';
        }
      }
    });
  }
}
