import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';
import { Socket } from 'socket.io-client';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import SceneUtil from '../utils/SceneUtil';
import { ResultUtil } from '../utils/ResultUtil';

export default class Result extends Scene {
  private socket: Socket;
  private centerX: number;
  private centerY: number;

  constructor() {
    super(Constant.SCENE.RESULT);
  }
  public init(data: { socket: Socket }): void {
    this.setSocket(data.socket);

    console.log('Result scene started');
  }
  public create(): void {
    if (!this.socket) return;

    const { centerX, centerY } = this.cameras.main;
    this.centerX = centerX;
    this.centerY = centerY;

    const { width, height } = this.sys.canvas;

    //背景
    SceneUtil.createBackground(this);

    this.getResult();
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }

  /* socket - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  private getResult(): void {
    this.socket.emit('GetResult', (response: { result: ICharacterDTO[] }) => {
      try {
        console.log('GetResult : ', response.result);
        ResultUtil.createResultDialog(
          this,
          this.centerX,
          this.centerY,
          response.result,
          this.leaveResult
        );
      } catch (error) {
        console.error(error);
      }
    });
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  private leaveResult(scene: Result): void {
    scene.socket.emit('LeaveResult', (response: { success: boolean }) => {
      console.log('leaveResult method');
      try {
        if (response.success) {
          scene.reload();
        } else {
          throw new Error('Fail to leave result');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  private reload(): void {
    location.reload();
  }
}
