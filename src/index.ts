import './styles/styles.scss';
import { phaserFactory } from './phaser-factory';

phaserFactory().then(() => import(/* webpackChunkName: "app" */ './app').then(({ App }) => new App()));
