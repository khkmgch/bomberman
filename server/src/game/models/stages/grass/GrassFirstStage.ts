import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { IFirstStage } from 'src/game/interfaces/stage/IFirstStage';
import { MathUtil } from 'src/game/utils/MathUtil';
import { GameObject } from '../../objects/GameObject';
import { User } from '../../User';
import { GrassStage } from './GrassStage';

// 草原ファーストステージクラス
export class GrassFirstStage extends GrassStage implements IFirstStage {
  // 草原ファーストステージ独自の情報
  // private firstStageInfo: string = 'You can see a big tree';

  constructor(eventsGateway: EventsGateway, roomId: string) {
    super(1, eventsGateway, roomId);
    this.setTileSize(Constant.TILE.SIZE);
    this.setRows(Constant.TILE.ROWS);
    this.setCols(Constant.TILE.COLS);
    this.initMap();
    this.addPlayers();
    this.addNpcs();
  }

  private initMap(): void {
    let map: GameObject[][] = new Array<Array<GameObject>>(this.cols);
    for (let i = 0; i < this.cols; i++) {
      map[i] = new Array<GameObject>(this.rows);
      for (let j = 0; j < this.rows; j++) {
        if (i === 0 || i === this.cols - 1 || j === 0 || j === this.rows - 1) {
          this.addEdgeObstacle(map, i, j);
          continue;
        }
        this.addGround(map, i, j);

        if (i % 2 === 0 && j % 2 === 0) {
          this.addFixedObstacle(map, i, j);
          continue;
        }
        if (i === 1 || i === this.cols - 2) {
          const mid = Math.floor(this.rows / 2);
          if (mid - 1 <= j && j <= mid + 1) {
            this.addBreakableObstacle(map, i, j);
          }
          continue;
        }
        if (j === 1 || j === this.rows - 2) {
          const mid = Math.floor(this.cols / 2);
          if (mid - 1 <= i && i <= mid + 1) {
            this.addBreakableObstacle(map, i, j);
          }
          continue;
        }
        const randomInt = MathUtil.getRandomInt(0, 4);
        if (randomInt <= 1) {
          this.addBreakableObstacle(map, i, j);
          continue;
        }
        map[i][j] = null;
      }
    }
    this.setMap(map);
  }
}
