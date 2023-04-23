import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import SceneUtil from '../utils/SceneUtil';
import TitleUtil from '../utils/TitleUtil';
export default class Title extends Scene {
  private socket: Socket;

  constructor() {
    super(Constant.SCENE.TITLE);
  }

  public init(data: { socket: Socket }): void {
    this.socket = data.socket;
    this.addSocketListeners();
  }

  public create(): void {
    const { centerX, centerY } = this.cameras.main;

    //背景
    SceneUtil.createBackground(this);

    //タイトル
    TitleUtil.createTitleText(this, centerX - 340, centerY - 350);

    //スタートボタン
    TitleUtil.createStartBtn(this, centerX, centerY - 60);

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

    TitleUtil.createItemUsage(this, centerX + 200, centerY + 150);

    //GitHub Button
    TitleUtil.createGitHubBtn(this, centerX, centerY + 420);

    this.events.on('start_lobby', this.startLobby, this);
  }

  private startLobby(): void {
    this.removeSocketListeners();
    this.scene.start(Constant.SCENE.LOBBY, {
      socket: this.socket,
    });
    this.socket.emit('JoinLobby');
    this.shutdown();
    this.scene.stop(Constant.SCENE.TITLE);
  }
  private shutdown(): void {
    // イベントリスナーの解除
    this.events.off('start_lobby', this.startLobby, this);

    // オブジェクトの削除
    this.children.removeAll(true);
  }
  private addSocketListeners(): void {
    this.onDisconnect();
    this.onClientId();
  }
  private removeSocketListeners(): void {
    this.offClientId();
    this.offDisConnect();
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', () => {
      console.log('サーバーとの接続が切れました。再接続を試みます。');
      const clientId: string | null = localStorage.getItem('clientId');
      if (!clientId) {
        location.reload();
      }
      this.socket.io.opts.query = { clientId: clientId }; // IDをセットして再接続
      this.socket.connect();

      this.addSocketListeners();
    });
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

  private offDisConnect(): void {
    this.socket.off('disconnect');
  }
}
