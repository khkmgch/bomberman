import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import * as Constants from '../../../server/src/constants';
export default class Title extends Scene {
  private socket: Socket;

  constructor() {
    super(Constants.SCENES.TITLE);
  }

  init(data: { socket: Socket }) {
    this.socket = data.socket;
    console.log(`id : ${this.socket.id}`);

    // this.socket.emit('events', { test: 'test' });
    // this.socket.emit('identity', 0, (response: number) =>
    //   console.log('Identity:', response)
    // );
    // this.socket.emit(
    //   'message',
    //   { message: 'testMessage' },
    //   (response: string) => {
    //     console.log('message', response);
    //   }
    // );

    // this.socket.on('events', function (data) {
    //   console.log('event', data);
    // });
    // this.socket.on('exception', function (data) {
    //   console.log('event', data);
    // });
    this.socket.on('disconnect', function () {
      console.log('サーバーとのソケット接続が切れました。');
    });
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    this.add.text(centerX - 300, centerY, 'Bomberman', {
      fontSize: '64px',
      fontFamily: 'PressStart2P',
      color: '#fff',
    });
    this.add.text(centerX - 300, centerY + 100, 'Bomberman', {
      fontSize: '64px',
      fontFamily: 'Ranchers',
      color: '#fff',
    });
  }
}
