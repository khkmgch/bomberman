import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';

export default class Lobby extends Scene {
  private socket: Socket;

  constructor() {
    super(Constant.SCENE.LOBBY);
  }
  init(data: { socket: Socket }) {
    console.log('lobby start!!');
    this.socket = data.socket;
    console.log(`id : ${this.socket.id}`);

    this.socket.on('disconnect', function () {
      console.log('サーバーとのソケット接続が切れました。');
    });
  }
}
