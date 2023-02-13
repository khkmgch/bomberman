import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import * as Constants from '../../../../server/src/constants';
export default class Preloader extends Scene {
  private isLoadCompleted: boolean = false;
  private socket: Socket;

  constructor() {
    super(Constants.SCENES.TITLE);
  }

  init() {
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    this.socket = socket;

    socket.on('connect', function () {
      console.log('サーバーとソケット接続しました。');

      // socket.emit('events', { test: 'test' });
      // socket.emit('identity', 0, (response: number) =>
      //   console.log('Identity:', response)
      // );
      // socket.emit('message', { message: 'testMessage' }, (response: string) => {
      //   console.log('message', response);
      // });
    });
    socket.on('events', function (data) {
      console.log('event', data);
    });
    socket.on('exception', function (data) {
      console.log('event', data);
    });
    socket.on('disconnect', function () {
      console.log('サーバーとのソケット接続が切れました。');
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

    this.load.once('complete', this.onLoadComplete);
  }

  onLoadComplete() {
    this.isLoadCompleted = true;
  }

  update(time: number, delta: number): void {
    if (!this.isLoadCompleted) return;
    this.scene.start(Constants.SCENES.TITLE, {
      socket: this.socket,
    });
  }
}
