import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import { IBombDTO } from '../dtos/interface/IBombDTO';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IExplosionDTO } from '../dtos/interface/IExplosionDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IItemDTO } from '../dtos/interface/IItemDTO';
import { IMarkerDTO } from '../dtos/interface/IMarkerDTO';
import { Guards } from '../guards/guards';
import { IBomb } from '../interfaces/IBomb';
import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IExplosion } from '../interfaces/IExplosion';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';
import { IItem } from '../interfaces/IItem';
import { IMarker } from '../interfaces/IMarker';
import { InputManager } from '../models/InputManager';
import { Objects } from '../types/Objects';
import { GameUtil } from '../utils/GameUtil';
import { SyncUtil } from '../utils/SyncUtil';
import { ISyncItemsDTO } from '../dtos/interface/ISyncItemsDTO';

export default class Game extends Scene {
  private centerX: number;
  private centerY: number;
  private socket: Socket;
  private objects: Objects = {
    characterMap: new Map<number, ICharacter>(),
    groundMap: new Map<number, IGround>(),
    breakableObstacleMap: new Map<number, IBreakableObstacle>(),
    fixedObstacleMap: new Map<number, IFixedObstacle>(),
    edgeObstacleMap: new Map<number, IEdgeObstacle>(),
    bombMap: new Map<number, IBomb>(),
    markerMap: new Map<number, IMarker>(),
    explosionMap: new Map<number, IExplosion>(),
    itemMap: new Map<number, IItem>(),
  };
  private inputManager: InputManager;

  private header: {
    timeText: Phaser.GameObjects.Text | null;
    fireUpText: Phaser.GameObjects.Text | null;
    bombUpText: Phaser.GameObjects.Text | null;
    speedUpText: Phaser.GameObjects.Text | null;
  } = {
    timeText: null,
    fireUpText: null,
    bombUpText: null,
    speedUpText: null,
  };

  constructor() {
    super(Constant.SCENE.GAME);
  }
  public init(data: { socket: Socket }): void {
    this.setSocket(data.socket);

    if (this.socket) {
      this.inputManager = new InputManager(this, this.socket);
    }
    // console.log('game scene started');
  }
  public create(): void {
    if (!this.socket) return;

    //ヘッダーの高さ分、カメラ位置を移動する（x, y座標は変わらない）
    this.cameras.main.scrollY = Constant.HEADER.HEIGHT * -1;

    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    this.addSocketListeners();
    this.socket.emit('ReadyToReceiveGame');

    //ヘッダーを作成
    GameUtil.createHeader(this);
  }

  public update(): void {
    this.inputManager.update();
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getObjects(): Objects {
    return this.objects;
  }
  public getCenterX(): number {
    return this.centerX;
  }
  public getCenterY(): number {
    return this.centerY;
  }
  public getHeader(): {
    timeText: Phaser.GameObjects.Text | null;
    fireUpText: Phaser.GameObjects.Text | null;
    bombUpText: Phaser.GameObjects.Text | null;
    speedUpText: Phaser.GameObjects.Text | null;
  } {
    return this.header;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }

  /* socket - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  private addSocketListeners(): void {
    this.onDisconnect();
    this.onClientId();
    this.onGetInitialState();
    this.onSyncState();
    this.onSyncTime();
    this.onCountDown();
    this.onAddBomb();
    this.onRemoveBomb();
    this.onAddMarkers();
    this.onRemoveMarkers();
    this.onAddExplosions();
    this.onRemoveExplosions();
    this.onRemoveBreakableObstacle();
    this.onAddItem();
    this.onRemoveItem();
    this.onDamaged();
    this.onDead();
    this.onSyncItems();
    this.onFinished();
  }
  private removeSocketListeners(): void {
    this.offDisconnect();
    this.offClientId();
    this.offGetInitialState();
    this.offSyncState();
    this.offSyncTime();
    this.offAddBomb();
    this.offRemoveBomb();
    this.offAddMarkers();
    this.offRemoveMarkers();
    this.offAddExplosions();
    this.offRemoveExplosions();
    this.offRemoveBreakObstacle();
    this.offAddItem();
    this.offRemoveItem();
    this.offDamaged();
    this.offDead();
    this.offSyncItems();
    this.offCountDown();
    this.offFinished();
  }
  private onDisconnect(): void {
    this.socket.on('disconnect', () => {
      console.log('サーバーとの接続が切れました。再接続を試みます。');
      const clientId: string | null = localStorage.getItem('clientId');
      const roomId: string | null = localStorage.getItem('roomId');
      if (!clientId || roomId) {
        location.reload();
      }
      this.socket.io.opts.query = { clientId: clientId, roomId: roomId }; // IDをセットして再接続
      this.socket.connect();

      this.addSocketListeners();
    });
  }
  private offDisconnect(): void {
    this.socket.off('disconnect');
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

  private onGetInitialState(): void {
    this.socket.on(
      'GetInitialState',
      (data: {
        groundArr: IGroundDTO[];
        edgeObstacleArr: IEdgeObstacleDTO[];
        fixedObstacleArr: IFixedObstacleDTO[];
        breakableObstacleArr: IBreakableObstacleDTO[];
        characterArr: ICharacterDTO[];
      }) => {
        try {
          if (Guards.isGetInitialStateDTO(data)) {
            SyncUtil.addGrounds(data.groundArr, this);
            SyncUtil.addEdgeObstacles(data.edgeObstacleArr, this);
            SyncUtil.addFixedObstacles(data.fixedObstacleArr, this);
            SyncUtil.addBreakableObstacles(data.breakableObstacleArr, this);
            SyncUtil.addCharacters(data.characterArr, this);
          } else {
            alert(
              'Failed to receive game information. Please reload the page and return to the title screen.'
            );
            location.reload();
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  private offGetInitialState(): void {
    this.socket.off('GetInitialState');
  }
  private onSyncState(): void {
    this.socket.on('SyncState', (data: { characterArr: ICharacterDTO[] }) => {
      SyncUtil.addCharacters(data.characterArr, this);
      SyncUtil.updateCharacter(this);
    });
  }
  private offSyncState(): void {
    this.socket.off('SyncState');
  }
  private onSyncTime(): void {
    this.socket.on('SyncTime', (data: { timeStr: string }) => {
      try {
        if (Guards.isSyncTimeDTO(data)) {
          this.header.timeText?.setText(data.timeStr);
        } else throw new Error('Invalid data format');
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offSyncTime(): void {
    this.socket.off('SyncTime');
  }
  private onAddBomb(): void {
    this.socket.on('AddBomb', (data: { bomb: IBombDTO }) => {
      try {
        if (Guards.isAddBombDTO(data)) {
          SyncUtil.addBomb(data.bomb, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offAddBomb(): void {
    this.socket.off('AddBomb');
  }
  private onRemoveBomb(): void {
    this.socket.on('RemoveBomb', (data: { id: number }) => {
      try {
        if (Guards.isRemoveBombDTO(data)) {
          SyncUtil.removeBomb(data.id, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveBomb(): void {
    this.socket.off('RemoveBomb');
  }
  private onAddMarkers(): void {
    this.socket.on('AddMarkers', (data: { markerArr: IMarkerDTO[] }) => {
      try {
        if (Guards.isAddMarkersDTO(data)) {
          SyncUtil.addMarkers(data.markerArr, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offAddMarkers(): void {
    this.socket.off('AddMarkers');
  }
  private onRemoveMarkers(): void {
    this.socket.on('RemoveMarkers', (data: { idArr: number[] }) => {
      try {
        if (Guards.isRemoveMarkersDTO(data)) {
          SyncUtil.removeMarkers(data.idArr, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveMarkers(): void {
    this.socket.off('RemoveMarkers');
  }
  private onAddExplosions(): void {
    this.socket.on(
      'AddExplosions',
      (data: { explosionArr: IExplosionDTO[] }) => {
        try {
          if (Guards.isAddExplosionsDTO(data)) {
            SyncUtil.addExplosions(data.explosionArr, this);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  private offAddExplosions(): void {
    this.socket.off('AddExplosions');
  }
  private onRemoveExplosions(): void {
    this.socket.on('RemoveExplosions', (data: { idArr: number[] }) => {
      try {
        if (Guards.isRemoveExplosionsDTO(data)) {
          SyncUtil.removeExplosions(data.idArr, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveExplosions(): void {
    this.socket.off('RemoveExplosions');
  }
  private onRemoveBreakableObstacle(): void {
    this.socket.on('RemoveBreakableObstacle', (data: { id: number }) => {
      try {
        if (Guards.isRemoveBreakableObstacleDTO(data)) {
          SyncUtil.removeRemoveBreakableObstacle(data.id, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveBreakObstacle(): void {
    this.socket.off('RemoveBreakableObstacle');
  }
  private onAddItem(): void {
    this.socket.on('AddItem', (data: { item: IItemDTO }) => {
      try {
        if (Guards.isAddItemDTO(data)) {
          SyncUtil.addItem(data.item, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offAddItem(): void {
    this.socket.off('AddItem');
  }
  private onRemoveItem(): void {
    this.socket.on('RemoveItem', (data: { id: number }) => {
      try {
        if (Guards.isRemoveItemDTO(data)) {
          SyncUtil.removeItem(data.id, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offRemoveItem(): void {
    this.socket.off('RemoveItem');
  }
  private onDamaged(): void {
    this.socket.on('Damaged', (data: { id: number }) => {
      try {
        if (Guards.isDamagedDTO(data)) {
          SyncUtil.flashCharacter(data.id, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offDamaged(): void {
    this.socket.off('Damaged');
  }
  private onDead(): void {
    this.socket.on('Dead', (data: { id: number }) => {
      try {
        if (Guards.isDeadDTO(data)) {
          SyncUtil.removeCharacter(data.id, this);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offDead(): void {
    this.socket.off('Dead');
  }
  private onSyncItems(): void {
    this.socket.on('SyncItems', (data: { items: ISyncItemsDTO }) => {
      try {
        if (Guards.isSyncItemsDTO(data)) {
          this.header.bombUpText?.setText(`× ${data.items.bombUp}`);
          this.header.fireUpText?.setText(`× ${data.items.fireUp}`);
          this.header.speedUpText?.setText(`× ${data.items.speedUp}`);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offSyncItems(): void {
    this.socket.off('SyncItems');
  }
  private onCountDown(): void {
    this.socket.on('CountDown', (data: { countDown: number }) => {
      try {
        if (Guards.isCountDownDTO(data)) {
          GameUtil.setCountDown(
            data.countDown,
            this,
            this.centerX,
            this.centerY
          );
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private offCountDown(): void {
    this.socket.off('CountDown');
  }
  private onFinished(): void {
    this.socket.on('Finished', () => {
      this.add
        .text(this.centerX, this.centerY, 'Finished', {
          fontSize: '116px',
          color: Constant.COLOR_STRING.POWDER_PINK,
          fontFamily: 'PressStart2P',
        })
        .setStroke(Constant.COLOR_STRING.LOTUS_PINK, 10)
        .setShadow(5, 5, Constant.COLOR_STRING.CHARCOAL_GRAY, 0, true, true)
        .setOrigin(0.5);

      setTimeout(() => {
        this.removeSocketListeners();
        this.scene.start(Constant.SCENE.RESULT, {
          socket: this.socket,
        });
        this.shutdown();
        this.scene.stop(Constant.SCENE.GAME);
      }, 5000);
    });
  }
  private offFinished(): void {
    this.socket.off('Finished');
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  private shutdown(): void {
    // オブジェクトの削除
    this.children.removeAll(true);
  }
}
