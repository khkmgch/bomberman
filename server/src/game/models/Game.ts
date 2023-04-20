import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { GrassStageFactory } from '../factories/stage/GrassStageFactory';
import { IStageFactory } from '../interfaces/factory/IStageFactory';
import { IStage } from '../interfaces/stage/IStage';
import { Player } from './objects/character/Player';
import { Npc } from './objects/character/Npc';

export class Game {
  private stageFactory: IStageFactory;
  private stage: IStage;
  private time: number;
  private startTime: number;
  private isAcceptingInput: boolean = false;
  private shouldUpdate: boolean = true;
  private elapsedSeconds: number;

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

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

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
        this.startTime = Date.now();
        this.time = Date.now();
        this.update();

        clearInterval(interval);
      }
    }, 1000);
  }

  public update(): void {
    let interval: NodeJS.Timer = setInterval(() => {
      if (!this.shouldUpdate) {
        clearInterval(interval);
      }

      if (this.stage === null) return;

      if (this.stage.isGameOver()) {
        this.stage.rankCharacters();
        clearInterval(interval);
        setTimeout(() => {
          //Finishedを表示
          //リザルト画面に遷移
          this.eventsGateway.server.in(this.roomId).emit('Finished');
        }, 1000);
      }
      //経過時間の算出

      //ミリ秒
      const currTime: number = Date.now();
      //秒
      const deltaTime: number = (currTime - this.time) * 0.001;
      this.time = currTime;

      this.stage.update(deltaTime);

      // 経過時間を秒単位で計算する
      const elapsedSeconds: number = Math.floor(
        (this.time - this.startTime) / 1000,
      );
      if (elapsedSeconds !== this.elapsedSeconds) {
        this.elapsedSeconds = elapsedSeconds;
        this.eventsGateway.server
          .in(this.roomId)
          .emit('SyncTime', { timeStr: this.getElapsedTimeStr() });
      }

      this.eventsGateway.server
        .in(this.roomId)
        .emit('SyncState', this.stage.getSyncState());
    }, 1000 / Constant.FRAMERATE);
  }

  public offUpdate(): void {
    this.shouldUpdate = false;
  }
  private getElapsedTimeStr(): string {
    // 経過時間を秒単位で計算する
    const elapsedSeconds: number = this.elapsedSeconds;

    // 分単位と秒単位に変換する
    const minutes: number = Math.floor(elapsedSeconds / 60);
    const seconds: number = elapsedSeconds % 60;

    // 2桁の0埋めで表記を整える
    const minutesStr: string = minutes.toString().padStart(2, '0');
    const secondsStr: string = seconds.toString().padStart(2, '0');

    // フォーマットを合わせて経過時間を表記する
    const elapsedTimeStr: string = `${minutesStr}:${secondsStr}`;
    return elapsedTimeStr;
  }
}
