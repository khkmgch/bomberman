import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import TitleUtil from '../util/titleUtil';
export default class Title extends Scene {
  private socket: Socket;

  constructor() {
    super(Constant.SCENES.TITLE);
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

    //背景
    this.add
      .sprite(0, 0, Constant.BACKGROUND)
      .setOrigin(0, 0)
      .play(Constant.BACKGROUND, true);

    //タイトル
    TitleUtil.createTitleText(this, centerX - 330, centerY - 350);

    //遊び方
    TitleUtil.createUsageTextBox(this, centerX - 440, centerY + 50, {
      wrapWidth: 880,
      fixedWidth: 880,
      fixedHeight: 300,
    });
    //Move
    TitleUtil.createMoveUsage(this, centerX, centerY + 150);
    //Bomb
    TitleUtil.createBombUsage(this, centerX - 440, centerY + 150);
  }
}
