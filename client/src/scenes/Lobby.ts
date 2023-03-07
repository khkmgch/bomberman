import { Scene } from 'phaser';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import { Socket } from 'socket.io-client';
import LobbyUtil from '../utils/LobbyUtil';
import Constant from '../../../server/src/constant';
import SceneUtil from '../utils/SceneUtil';
// import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
import GridTable from 'phaser3-rex-plugins/templates/ui/gridtable/GridTable';
import { IRoomDTO } from '../dtos/IRoomDTO';
import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog';
import { Guards } from '../guards/guards';
import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import { IUserDTO } from '../dtos/IUserDTO';
import GridSizer from 'phaser3-rex-plugins/templates/ui/gridsizer/GridSizer';
import ContainerLite from 'phaser3-rex-plugins/plugins/containerlite';

export default class Lobby extends Scene {
  private socket: Socket;
  private nameInput: Label;
  private newRoomBtn: Buttons;
  private rooms: IRoomDTO[];
  private tableOfRooms: GridTable;
  private roomDialog: Dialog | null;
  private startGameBtn: Buttons | null;

  constructor() {
    super(Constant.SCENE.LOBBY);
  }
  public init(data: { socket: Socket }) {
    this.setSocket(data.socket);

    this.addSocketListeners();
  }

  public create() {
    const { centerX, centerY } = this.cameras.main;

    const { width, height } = this.sys.canvas;

    //背景
    SceneUtil.createBackground(this);

    //NameInputLabel
    LobbyUtil.createNameInputLabel(this, 50, 50);

    //NameInput
    this.setNameInput(
      LobbyUtil.createNameInput(this, 200, 120, width / 3, 50, 'Unknown')
    );

    //NewRoomBtn
    this.setNewRoomBtn(
      LobbyUtil.createNewRoomBtn(this, centerX, centerY - 200)
    );

    //Table of Rooms
    this.tableOfRooms = LobbyUtil.createTableOfRooms(
      this,
      centerX,
      centerY + 130,
      this.getRooms()
    )
      .on('cell.click', this.mouseClickRoom, this)
      .on('cell.over', this.mouseHoverRoom, this)
      .on('cell.out', this.mouseOutRoom, this);

    this.events.on('create_room', this.createRoom, this);
    this.events.on('start_game', this.startGame, this);
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  public getSocket(): Socket {
    return this.socket;
  }
  public getNameInput(): Label {
    return this.nameInput;
  }
  public getRooms(): IRoomDTO[] {
    return this.rooms;
  }
  public getNewRoomBtn(): Buttons {
    return this.newRoomBtn;
  }
  public getTableOfRooms(): GridTable {
    return this.tableOfRooms;
  }
  public getRoomDialog(): Dialog | null {
    return this.roomDialog;
  }
  public getStartGameBtn(): Buttons | null {
    return this.startGameBtn;
  }
  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }
  public setNameInput(nameInput: Label): void {
    this.nameInput = nameInput;
  }
  public setNewRoomBtn(btn: Buttons): void {
    this.newRoomBtn = btn;
  }
  public setRooms(rooms: IRoomDTO[]): void {
    this.rooms = rooms;
  }
  public setTableOfRooms(table: GridTable): void {
    this.tableOfRooms = table;
  }
  public setRoomDialog(dialog: Dialog | null): void {
    this.roomDialog = dialog;
  }
  public setStartGameBtn(btn: Buttons | null): void {
    this.startGameBtn = btn;
  }

  /* Socket - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  private addSocketListeners(): void {
    this.onGetRooms();
    this.onCloseRoomDialog();
    this.onUpsertUser();
    this.onRemoveUser();
    this.onLeaveLobby();
  }
  private removeSocketListeners(): void {
    this.offGetRooms();
    this.offCloseRoomDialog();
    this.offUpsertUser();
    this.offRemoveUser();
    this.offLeaveLobby();
  }

  private onGetRooms(): void {
    this.socket.on('GetRooms', (data: { rooms: IRoomDTO[] }) => {
      try {
        if (Guards.isGetRoomsDTO(data)) {
          this.setRooms(data.rooms);
          this.updateTableOfRooms();
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offGetRooms(): void {
    this.socket.off('GetRooms');
  }
  private onCloseRoomDialog(): void {
    this.socket.on('CloseRoomDialog', () => {
      this.closeRoomDialog(this);
    });
  }
  private offCloseRoomDialog(): void {
    this.socket.off('CloseRoomDialog');
  }
  private onUpsertUser(): void {
    this.socket.on('UpsertUser', (data: { user: IUserDTO }) => {
      try {
        if (Guards.isUpsertUserDTO(data)) {
          this.upsertPlayerPanel(data.user);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offUpsertUser(): void {
    this.socket.off('UpsertUser');
  }
  private onRemoveUser(): void {
    this.socket.on('RemoveUser', (data: { user: IUserDTO }) => {
      try {
        if (Guards.isRemoveUserDTO(data)) {
          this.removePlayerPanel(data.user);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveUser(): void {
    this.socket.off('RemoveUser');
  }
  private onLeaveLobby(): void {
    this.socket.on('LeaveLobby', () => {
      this.removeSocketListeners();
      this.scene.start(Constant.SCENE.GAME, {
        socket: this.socket,
      });
      this.shutdown();
      this.scene.stop(Constant.SCENE.LOBBY);
    });
  }
  private offLeaveLobby(): void {
    this.socket.off('LeaveLobby');
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  private shutdown() {
    // イベントリスナーの解除
    this.events.off('create_room', this.createRoom, this);
    this.events.off('start_game', this.startGame, this);

    // アニメーションの停止
    this.anims.pauseAll();

    // オブジェクトの削除
    this.children.removeAll(true);
  }

  private updateTableOfRooms() {
    const rooms = this.getRooms();
    if (rooms.length <= 0) {
      rooms.push({
        id: '0',
        host: { socketId: '0', userName: '', id: -1, state: '' },
        users: [{ socketId: '0', userName: '', id: -1, state: '' }],
        numUsers: 0,
        maxUsers: 0,
      });
    }
    this.getTableOfRooms().setItems(rooms);
    this.getTableOfRooms().refresh();
  }

  private createRoom() {
    this.socket.emit(
      'CreateRoom',
      { userName: this.getNameInput().text },
      (response: { roomId: string }) => {
        try {
          if (Guards.isCreateRoomDTO(response)) {
            this.joinRoom(response.roomId, this.getNameInput().text);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  //対戦ルームに入室したことをルーム内の全ユーザーに知らせるためのメソッド
  private notifyRoomJoin() {
    this.socket.emit('NotifyRoomJoin', { roomId: this.socket.roomId });
  }
  //ルーム内のユーザーを取得し、プレイヤーのパネルをセットするメソッド
  private getRoomUsers() {
    this.socket.emit(
      'GetRoomUsers',
      { roomId: this.socket.roomId },
      (response: { users: IUserDTO[] }) => {
        try {
          response.users.forEach((user) => this.upsertPlayerPanel(user));
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  private joinRoom(id: string, userName: string) {
    this.socket.emit(
      'JoinRoom',
      {
        roomId: id,
        userName: userName,
      },
      (response: { success: boolean; room: IRoomDTO; isHost: boolean }) => {
        try {
          if (Guards.isJoinRoomDTO(response)) {
            if (response.success) {
              this.socket.roomId = response.room.id;

              this.diableButtons();
              const { centerX, centerY } = this.cameras.main;

              this.setRoomDialog(
                LobbyUtil.createRoomDialog(
                  this,
                  centerX,
                  centerY,
                  this.leaveRoom,
                  this.readyToStartGame
                )
              );

              this.getRoomUsers();

              if (response.isHost) {
                this.setStartGameBtn(
                  LobbyUtil.createStartGameBtn(
                    this,
                    centerX,
                    centerY + 300
                  ).scaleYoyo(300)
                );
              } else {
                this.notifyRoomJoin();
              }
            } else {
              throw new Error('Reaponse status is error');
            }
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private leaveRoom(scene: Lobby) {
    scene.socket.emit(
      'LeaveRoom',
      { roomId: scene.socket.roomId },
      (response: { success: boolean }) => {
        try {
          if (Guards.isLeaveRoomDTO(response)) {
            scene.closeRoomDialog(scene);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  //ゲーム開始できるように、プレイヤーの状態をWATINGからREADYに変更するメソッド
  private readyToStartGame(scene: Lobby) {
    scene.socket.emit('ReadyToStartGame');
  }

  private startGame() {
    this.socket.emit(
      'CheckAllPlayersReady',
      (response: { isReady: boolean }) => {
        console.log(response);
        try {
          if (Guards.isCheckAllPlayersReadyDTO(response)) {
            if (response.isReady) {
              this.socket.emit('StartGame');
            } else {
              alert('All players must be ready to start game');
            }
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private closeRoomDialog(scene: Lobby) {
    scene.socket.roomId = '';
    //ルームダイアログを閉じる
    scene.getRoomDialog()?.scaleDownDestroy(100);
    scene.setRoomDialog(null);

    //スタートボタンを閉じる
    scene.getStartGameBtn()?.scaleDownDestroy(100);
    scene.setStartGameBtn(null);

    //ロビーのボタンを有効化
    scene.enableButtons();
  }

  private upsertPlayerPanel(player: IUserDTO) {
    const dialog = this.getRoomDialog();
    if (dialog !== null) {
      const dialogContent = dialog.getElement('content') as GridSizer;
      const playerPanel = dialogContent.getChildren().at(player.id) as Label;
      playerPanel.setText(player.userName);
      const icon = playerPanel.getElement('icon') as ContainerLite;
      icon.getChildren().forEach((child: any, i: number) => {
        if (i === 0) {
          if (player.state === Constant.PLAYER_STATE.READY) {
            child.setFillStyle(Constant.COLOR_NUMBER.TURQUOISE_BLUE);
          } else {
            child.setFillStyle(Constant.COLOR_NUMBER.MIST);
          }
        } else if (i === 1) {
          if (player.state === Constant.PLAYER_STATE.READY) {
            child.setText('ready');
          } else {
            child.setText('not ready');
          }
        } else if (i === 2) {
          child.setFillStyle(Constant.COLOR_NUMBER.NAPLES_YELLOW);
        } else if (i === 3) {
          if (player.state === Constant.PLAYER_STATE.READY) {
            child.play(
              {
                key: `${Object.values(Constant.CAT)[player.id]}-down`,
                repeat: -1,
              },
              true
            );
          } else {
            child.play(
              {
                key: `${Object.values(Constant.CAT)[player.id]}-turn-down`,
              },
              true
            );
          }
        }
      });
      setTimeout(() => {
        LobbyUtil.flipPlayerPanel(this, playerPanel, 'back');
      }, 200);
    }
  }
  private removePlayerPanel(player: IUserDTO) {
    const dialog = this.getRoomDialog();
    if (dialog !== null) {
      const dialogContent = dialog.getElement('content') as GridSizer;
      const playerPanel = dialogContent.getChildren().at(player.id) as Label;
      const icon = playerPanel.getElement('icon') as ContainerLite;
      icon.getChildren().forEach((child: any, i: number) => {
        if (i === 0) {
          child.setFillStyle(Constant.COLOR_NUMBER.MIST);
        } else if (i === 1) {
          child.setText('not ready');
        }
      });
      dialog.layout();
      LobbyUtil.flipPlayerPanel(this, playerPanel, 'front');
    }
  }

  private hasRoom(index: number) {
    return this.getRooms() && 0 <= index && index < this.getRooms().length;
  }

  private diableButtons() {
    this.getNewRoomBtn().setButtonEnable(false);
    this.tableOfRooms.off('cell.click', this.mouseClickRoom, this);
    this.tableOfRooms.off('cell.over', this.mouseHoverRoom, this);
    this.tableOfRooms.off('cell.out', this.mouseOutRoom, this);
  }
  private enableButtons() {
    this.getNewRoomBtn().setButtonEnable(true);
    this.tableOfRooms.on('cell.click', this.mouseClickRoom, this);
    this.tableOfRooms.on('cell.over', this.mouseHoverRoom, this);
    this.tableOfRooms.on('cell.out', this.mouseOutRoom, this);
  }

  private mouseClickRoom(cellContainer: any, cellIndex: number, pointer: any) {
    if (cellContainer.getElement('text').text !== Constant.NO_ROOM_TEXT) {
      if (this.hasRoom(cellIndex)) {
        console.log(this.getRooms()[cellIndex]);
        const room = this.getRooms()[cellIndex];
        this.joinRoom(room.id, this.getNameInput().text);
      }
    }
  }
  private mouseHoverRoom(cellContainer: any, cellIndex: number, pointer: any) {
    if (cellContainer.getElement('text').text !== Constant.NO_ROOM_TEXT)
      cellContainer
        .getElement('background')
        .setStrokeStyle(2, Constant.COLOR_NUMBER.POWDER_PINK)
        .setFillStyle(Constant.COLOR_NUMBER.MIST);
  }
  private mouseOutRoom(cellContainer: any, cellIndex: number, pointer: any) {
    if (cellContainer.getElement('text').text !== Constant.NO_ROOM_TEXT)
      cellContainer
        .getElement('background')
        .setStrokeStyle(2, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
        .setFillStyle(Constant.COLOR_NUMBER.POWDER_PINK);
  }
}
