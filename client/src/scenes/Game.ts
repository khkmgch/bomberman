import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import Constant from '../../../server/src/constant';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { Guards } from '../guards/guards';
import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';
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
    bombMap: {},
    explosionMap: {},
    itemMap: {},
  };
  private inputManager: InputManager;

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

    // this.add
    //   .sprite(200, 200, 'flower_white')
    //   .play({ key: 'flower_white-anim', repeat: -1, frameRate: 1 })
    //   .setScale(1.0);
    // this.add
    //   .sprite(400, 200, 'flower_red')
    //   .play({ key: 'flower_red-anim', repeat: -1, frameRate: 1 })
    //   .setScale(1.0);
    // this.add
    //   .sprite(600, 200, 'grass1')
    //   .play({ key: 'grass1-anim', repeat: -1, frameRate: 1 })
    //   .setScale(1.0);
    // this.add
    //   .sprite(200, 400, 'grass2')
    //   .play({ key: 'grass2-anim', repeat: -1, frameRate: 1 })
    //   .setScale(1.0);
    // this.add
    //   .sprite(400, 400, 'grass3')
    //   .play({ key: 'grass3-anim', repeat: -1, frameRate: 1 })
    //   .setScale(1.0);
    this.addSocketListeners();
    this.socket.emit('ReadyToReceiveGame');
  }

  public update(): void {
    this.inputManager.update();

    // SyncUtil.updateCharacter(this);
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getObjects(): Objects {
    return this.objects;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }
  /* socket - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  private addSocketListeners(): void {
    this.onGetInitialState();
    this.onSyncState();
    this.onCountDown();
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
        try {
          if (Guards.isGetInitialStateDTO(data)) {
            SyncUtil.setGrounds(data.groundArr, this);
            SyncUtil.setEdgeObstacles(data.edgeObstacleArr, this);
            SyncUtil.setFixedObstacles(data.fixedObstacleArr, this);
            SyncUtil.setBreakableObstacles(data.breakableObstacleArr, this);
            SyncUtil.setCharacters(data.characterArr, this);
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
      // console.log(data);
      SyncUtil.setCharacters(data.characterArr, this);
      SyncUtil.updateCharacter(this);
    });
  }
  private onCountDown(): void {
    this.socket.on('CountDown', (data: { countDown: number }) => {
      GameUtil.setCountDown(data.countDown, this, this.centerX, this.centerY);
    });
  }
}
