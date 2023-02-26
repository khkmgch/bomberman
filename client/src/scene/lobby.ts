import { Scene } from 'phaser';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import SceneUtil from '../util/sceneUtil';
import LobbyUtil from '../util/lobbyUtil';
import TitleUtil from '../util/titleUtil';

export default class Lobby extends Scene {
  private socket: Socket;
  private nameInput: Label;

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

  create() {
    const { centerX, centerY } = this.cameras.main;

    const { width, height } = this.sys.canvas;

    //背景
    SceneUtil.createBackground(this);

    // LobbyUtil.createLobbySizer(this, centerX, centerY, width, height);

    //NameInputLabel
    LobbyUtil.createNameInputLabel(this, 50, 50);
    //NameInput
    this.nameInput = LobbyUtil.createNameInput(
      this,
      200,
      120,
      width / 3,
      50,
      'Unknown'
    );

    //NewRoomBtn
    LobbyUtil.createNewRoomBtn(this, centerX, centerY - 200);

    //Table of Rooms
    LobbyUtil.createTableOfRooms(this, centerX, centerY + 130, []);

    this.events.on('create_room', this.createRoom, this);
  }
  createRoom() {
    console.log(this.nameInput.text);
  }
}
