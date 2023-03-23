import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { GrassStageFactory } from '../factories/stage/GrassStageFactory';
import { IStageFactory } from '../interfaces/factory/IStageFactory';
import { IStage } from '../interfaces/stage/IStage';

export class Game {
  private stageFactory: IStageFactory;
  private stage: IStage;
  private time: number;
  private isAcceptingInput: boolean = false;

  constructor(private eventsGateway: EventsGateway, private roomId: string) {
    this.setStageFactory(new GrassStageFactory(eventsGateway, roomId));
    this.setStage(this.stageFactory.createFirstStage());
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getStage() {
    return this.stage;
  }
  public getIsAcceptingInput(): boolean {
    return this.isAcceptingInput;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setStageFactory(factory: IStageFactory): void {
    this.stageFactory = factory;
  }
  public setStage(stage: IStage): void {
    this.stage = stage;
  }

  /* others- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public startCountDown() {
    const countDown: number[] = [3, 2, 1];

    // クライアントにカウントダウンを送信する
    let count: number = 0;
    const interval = setInterval(() => {
      if (count < countDown.length) {
        this.eventsGateway.server
          .in(this.roomId)
          .emit('CountDown', { countDown: countDown[count] });
        count++;
      } else {
        this.eventsGateway.server
          .in(this.roomId)
          .emit('CountDown', { countDown: 0 });

        this.isAcceptingInput = true;
        this.time = Date.now();
        this.update();

        clearInterval(interval);
      }
    }, 1000);
  }

  public update(): void {
    let interval = setInterval(() => {
      //経過時間の算出

      //ミリ秒
      const currTime = Date.now();
      //秒
      const deltaTime = (currTime - this.time) * 0.001;
      this.time = currTime;

      this.stage.update(deltaTime);

      this.eventsGateway.server
        .in(this.roomId)
        .emit('SyncState', this.stage.getSyncState());
    }, 1000 / Constant.FRAMERATE);
  }

  // public update() {
  //   // 周期的処理（1秒間にFRAMERATE回の場合、delayは、1000[ms]/FRAMERATE[回]）
  //   let timerId = setInterval(() => {
  //     // 経過時間の算出
  //     const currTime = Date.now(); // ミリ秒単位で取得
  //     const deltaTime = (currTime - this.time) * 0.001; // 秒に変換
  //     this.time = currTime;
  //     //console.log( 'DeltaTime = %f[s]', fDeltaTime );
  //     // 処理時間計測用
  //     // const hrtime = process.hrtime(); // ナノ秒単位で取得
  //     // ゲームステージの更新
  //     this.stage.update(deltaTime);
  //     // const hrtimeDiff = process.hrtime(hrtime);
  //     // const nanoSecDiff =
  //     //   hrtimeDiff[0] * 1e9 + hrtimeDiff[1];
  //     const time = (currTime - this.startTime) * 0.001;
  //     //ルーム内のユーザーにデータを送信
  //     this.roomManager.ioNspGame.in(this.roomId).emit('syncGame', {
  //       time: time,
  //       playerArr: this.stage.playerList.toArray(),
  //       npcArr: this.stage.npcList.toArray(),
  //       bombArr: this.stage.bombList.toArray(),
  //       explosionArr: this.stage.explosionList.toArray(),
  //       itemArr: this.stage.itemList.toArray(),
  //     });

  //     if (time >= 180) {
  //       clearInterval(timerId);
  //       this.roomManager.ioNspGame.in(this.roomId).emit('timeUp');
  //     }
  //   }, 1000 / ServerConfig.FRAMERATE); // 単位は[ms]。1000[ms] / FRAMERATE[回]
  // }
}
