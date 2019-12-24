import { BootScene } from './boot';
import { LoadScene } from './load';
import { CreateGameScene, CreatePlayerScene, LoadGameScene, RootScene } from './play';
import { TitleScene } from './title';

export { SceneKey } from './scene-key.enum';

/**
 * Game scenes.
 */
export const scenes = [BootScene, LoadScene, TitleScene, RootScene, CreatePlayerScene, CreateGameScene, LoadGameScene];
