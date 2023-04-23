import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import AnimationUtil from '../utils/AnimationUtil';

export default class Preloader extends Scene {
  private socket: Socket;

  constructor() {
    super(Constant.SCENE.PRELOADER);
  }

  public init(): void {
    const clientId: string | null = localStorage.getItem('clientId');
    const socket: Socket = io(`${import.meta.env.VITE_API_URL}`, {
      query: {
        clientId: clientId || null, // localStorageにclientIdが存在しない場合はnullを送信
      },
    });
    this.socket = socket;

    this.addSocketListenters();
  }

  public preload(): void {
    const { centerX, centerY } = this.cameras.main;

    this.add.text(centerX - 100, centerY, 'Loading...', {
      fontSize: '32px',
      color: '#fff',
    });

    const frameWidth = Constant.TIP_SIZE;
    const frameHeight = Constant.TIP_SIZE;

    //背景
    this.load.spritesheet(
      Constant.BACKGROUND,
      `assets/ui/${Constant.BACKGROUND}.png`,
      {
        frameWidth: 960,
        frameHeight: 1000,
      }
    );

    //キャラクター
    for (const value of Object.values(Constant.CHARACTER)) {
      this.load.spritesheet(value, `assets/character/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }
    //猫
    for (const value of Object.values(Constant.CAT)) {
      this.load.spritesheet(value, `assets/character/cat/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }
    //爆弾・爆風・マーカー
    for (const value of Object.values(Constant.ATTACK)) {
      this.load.spritesheet(value, `assets/attack/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }
    //アイテム
    for (const value of Object.values(Constant.ITEM)) {
      this.load.image(value, `assets/item/${value}.png`);
    }

    //花
    for (const value of Object.values(Constant.FLOWER)) {
      this.load.spritesheet(value, `assets/map/flower/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }
    //草
    for (const value of Constant.GRASS) {
      this.load.spritesheet(value, `assets/map/grass/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }

    //箱
    this.load.image(Constant.BOX, `assets/map/obstacle/${Constant.BOX}.png`);
    //岩
    for (const value of Constant.ROCK) {
      this.load.image(value, `assets/map/obstacle/${value}.png`);
    }
    //水
    for (const value of Constant.WATER) {
      this.load.spritesheet(value, `assets/map/obstacle/${value}.png`, {
        frameWidth,
        frameHeight,
      });
    }

    //矢印
    for (const value of Object.values(Constant.ARROW)) {
      this.load.image(value, `assets/ui/arrow/${value}.png`);
    }

    //github
    this.load.image(Constant.GITHUB, `assets/ui/${Constant.GITHUB}.png`);

    //space
    this.load.image(Constant.SPACE, `assets/ui/${Constant.SPACE}.png`);

    this.load.once('complete', this.onLoadComplete, this);
  }

  private onLoadComplete(): void {
    AnimationUtil.createBackgroundAnim(this.anims);
    AnimationUtil.createCatAnim(this.anims);
    AnimationUtil.createBombAnim(this.anims);
    AnimationUtil.createExplosionAnim(this.anims);

    AnimationUtil.createFlowerAnim(this.anims);
    AnimationUtil.createGrassAnim(this.anims);
    AnimationUtil.createWaterAnim(this.anims);

    this.removeSocketListeners();

    this.scene.start(Constant.SCENE.TITLE, {
      socket: this.socket,
    });
  }

  /* Socket - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  private addSocketListenters(): void {
    this.onClientId();
    this.onConnect();
  }
  private removeSocketListeners(): void {
    this.offClientId();
    this.offConnect();
  }
  private onClientId(): void {
    // サーバーからclientIdを受信した際の処理
    this.socket.on('ClientId', (data: { clientId: string }) => {
      console.log('Server sent clientId:', data.clientId);

      // 受信したclientIdをlocalStorageに保存
      localStorage.setItem('clientId', data.clientId);
    });
  }
  private offClientId(): void {
    this.socket.off('ClientId');
  }
  private onConnect(): void {
    this.socket.on('connect', function () {
      console.log('サーバーとソケット接続しました。');
    });
  }
  private offConnect(): void {
    this.socket.off('connect');
  }
}
