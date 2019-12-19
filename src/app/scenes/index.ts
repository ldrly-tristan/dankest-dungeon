import { BootScene } from './boot-scene';
export { BootScene } from './boot-scene';
import { LoadScene } from './load-scene';
export { LoadScene } from './load-scene';
import { CreateGameScene, CreatePlayerScene, LoadGameScene, RootScene } from './play';
export { CreateGameScene, CreatePlayerScene, LoadGameScene, RootScene } from './play';
import { TitleScene } from './title-scene';
export { TitleScene } from './title-scene';

/**
 * Game scenes.
 */
export const scenes = [BootScene, LoadScene, TitleScene, RootScene, CreatePlayerScene, CreateGameScene, LoadGameScene];
