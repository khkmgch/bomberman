import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { IFirstStage } from 'src/game/interfaces/stage/IFirstStage';
import { MathUtil } from 'src/game/utils/MathUtil';
import { Npc } from '../../objects/character/Npc';
import { Player } from '../../objects/character/Player';
import { User } from '../../User';
import { GrassStage } from './GrassStage';
import { Cell } from 'src/game/types/Cell';

// 草原ファーストステージクラス
export class GrassFirstStage extends GrassStage implements IFirstStage {
  // 草原ファーストステージ独自の情報
  private firstStageInfo: string = 'You can see small flowers';

  constructor(eventsGateway: EventsGateway, roomId: string) {
    super(1, eventsGateway, roomId);
    this.setTileSize(Constant.TILE.SIZE);
    this.setRows(Constant.TILE.ROWS);
    this.setCols(Constant.TILE.COLS);
    this.initMap();
    this.initImpactMaps();
    this.addPlayers();
    this.addNpcs();
  }

  private initMap(): void {
    let map: Cell[][] = new Array<Array<Cell>>(this.cols);
    for (let i = 0; i < this.cols; i++) {
      map[i] = new Array<Cell>(this.rows);
      for (let j = 0; j < this.rows; j++) {
        map[i][j] = {
          index: { i, j },
          entity: null,
          item: null,
        };
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

        if (Math.random() < 0.5) {
          this.addBreakableObstacle(map, i, j);
          continue;
        }
      }
    }
    this.setMap(map);
  }

  protected addPlayers(): void {
    const userMap: Map<string, User> = this.eventsGateway.roomService
      .getRoomMap()
      .get(this.roomId)
      .getUserMap();
    for (const user of userMap) {
      this.playerMap.set(user[1].getId(), this.createPlayer(user[1]));
    }
  }

  private createPlayer(user: User): Player {
    const id: number = user.getId();
    const {
      x,
      y,
    }: {
      x: number;
      y: number;
    } = this.getCharacterInitialPosition(id);

    return new Player(id, user.getSocket(), user.getUserName(), x, y, this);
  }

  protected addNpcs(): void {
    for (let i = 0; i < Constant.MAX_PLAYERS_PER_ROOM; i++) {
      if (!this.playerMap.has(i)) {
        this.npcMap.set(i, this.createNpc(i));
      }
    }
  }
  private createNpc(id: number): Npc {
    const name: string =
      GrassStage.NPC_NAME_ARR[
        MathUtil.getRandomInt(0, GrassStage.NPC_NAME_ARR.length)
      ];
    const {
      x,
      y,
    }: {
      x: number;
      y: number;
    } = this.getCharacterInitialPosition(id);

    return new Npc(id, name, x, y, this);
  }
}
