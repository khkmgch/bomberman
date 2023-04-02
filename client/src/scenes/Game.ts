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
  public init(data: { socket: Socket }) {
    this.setSocket(data.socket);

    if (this.socket) {
      this.inputManager = new InputManager(this, this.socket);
    }

    console.log('game scene started');
    // this.addSocketListeners();
  }
  public create() {
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
  }
  private removeSocketListeners(): void {}

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
        console.log(data);
        try {
          if (Guards.isGetInitialStateDTO(data)) {
            SyncUtil.addGrounds(data.groundArr, this);
            SyncUtil.addEdgeObstacles(data.edgeObstacleArr, this);
            SyncUtil.addFixedObstacles(data.fixedObstacleArr, this);
            SyncUtil.addBreakableObstacles(data.breakableObstacleArr, this);
            SyncUtil.addCharacters(data.characterArr, this);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  private onSyncState(): void {
    this.socket.on('SyncState', (data: { characterArr: ICharacterDTO[] }) => {
      SyncUtil.addCharacters(data.characterArr, this);
      SyncUtil.updateCharacter(this);
    });
  }
  private onSyncTime(): void {
    this.socket.on('SyncTime', (data: { timeStr: string }) => {
      this.header.timeText?.setText(data.timeStr);
    });
  }
  private onAddBomb(): void {
    this.socket.on('AddBomb', (data: { bomb: IBombDTO }) => {
      try {
        SyncUtil.addBomb(data.bomb, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onRemoveBomb(): void {
    this.socket.on('RemoveBomb', (data: { id: number }) => {
      try {
        SyncUtil.removeBomb(data.id, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onAddMarkers(): void {
    this.socket.on('AddMarkers', (data: { markerArr: IMarkerDTO[] }) => {
      try {
        SyncUtil.addMarkers(data.markerArr, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onRemoveMarkers(): void {
    this.socket.on('RemoveMarkers', (data: { idArr: number[] }) => {
      try {
        SyncUtil.removeMarkers(data.idArr, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onAddExplosions(): void {
    this.socket.on(
      'AddExplosions',
      (data: { explosionArr: IExplosionDTO[] }) => {
        try {
          SyncUtil.addExplosions(data.explosionArr, this);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
  private onRemoveExplosions(): void {
    this.socket.on('RemoveExplosions', (data: { idArr: number[] }) => {
      try {
        SyncUtil.removeExplosions(data.idArr, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onRemoveBreakableObstacle(): void {
    this.socket.on('RemoveBreakableObstacle', (data: { id: number }) => {
      try {
        SyncUtil.removeRemoveBreakableObstacle(data.id, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onAddItem(): void {
    this.socket.on('AddItem', (data: { item: IItemDTO }) => {
      try {
        SyncUtil.addItem(data.item, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onRemoveItem(): void {
    this.socket.on('RemoveItem', (data: { id: number }) => {
      try {
        SyncUtil.removeItem(data.id, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onDamaged(): void {
    this.socket.on('Damaged', (data: { id: number }) => {
      try {
        SyncUtil.flashCharacter(data.id, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onDead(): void {
    this.socket.on('Dead', (data: { id: number }) => {
      try {
        SyncUtil.removeCharacter(data.id, this);
      } catch (error) {
        console.error(error);
      }
    });
  }
  private onCountDown(): void {
    this.socket.on('CountDown', (data: { countDown: number }) => {
      GameUtil.setCountDown(data.countDown, this, this.centerX, this.centerY);
    });
  }
}
