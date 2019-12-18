import { enableAkitaProdMode } from '@datorama/akita';

import './styles/styles.scss';
import { phaserFactory } from './phaser-factory';

if (process.env.NODE_ENV === 'production') {
  enableAkitaProdMode();
}

phaserFactory().then(() => import(/* webpackChunkName: "app" */ './app').then(({ App }) => new App()));
