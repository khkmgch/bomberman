import Phaser from 'phaser';
import Preloader from '../scene/preloader';
import Title from '../scene/title';
import * as Constants from '../../../server/src/constants';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    width: Constants.CANVAS.WIDTH,
    height: Constants.CANVAS.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  scene: [Preloader, Title],
  // backgroundColor: '#a9a9a9',
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
      // ...
    ],
  },
};

export default gameConfig;
