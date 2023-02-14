import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import * as Constants from '../../../server/src/constants';

export default class Preloader extends Scene {
  private socket: Socket;

  constructor() {
    super(Constants.SCENES.PRELOADER);
  }

  init() {
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    this.socket = socket;

    socket.on('connect', function () {
      console.log('サーバーとソケット接続しました。');
    });
  }

  preload() {
    const { centerX, centerY } = this.cameras.main;

    this.add.text(centerX - 100, centerY, 'Loading...', {
      fontSize: '32px',
      color: '#fff',
    });

    const frameWidth = Constants.TIP_SIZE;
    const frameHeight = Constants.TIP_SIZE;

    for (let value of Object.values(Constants.CHATACTERS)) {
      this.load.spritesheet(value, `assets/character/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }
    this.load.spritesheet('bomb', 'assets/attack/bomb.png', {
      frameWidth,
      frameHeight,
    });

    this.load.once('complete', this.onLoadComplete, this);
  }

  onLoadComplete() {
    this.scene.start(Constants.SCENES.TITLE, {
      socket: this.socket,
    });
  }
}
