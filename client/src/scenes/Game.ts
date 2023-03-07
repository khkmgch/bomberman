import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';

export default class Game extends Scene {
  private socket: Socket;

  constructor() {
    super(Constant.SCENE.GAME);
  }
  public init(data: { socket: Socket }) {
    this.setSocket(data.socket);

    console.log('game scene started');
    // this.addSocketListeners();
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }
}
