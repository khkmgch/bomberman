import Phaser from 'phaser';
import Preloader from '../scene/preloader';
import Title from '../scene/title';
import Constant from '../../../server/src/constant';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Lobby from '../scene/lobby';
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    width: Constant.CANVAS.WIDTH,
    height: Constant.CANVAS.HEIGHT,
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
  backgroundColor: Constant.COLOR_STRING.WHITE,
  scene: [Preloader, Title, Lobby],
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
};

export default gameConfig;
