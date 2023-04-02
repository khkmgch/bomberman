import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { MathUtil } from 'src/game/utils/MathUtil';
import { BreakableObstacle } from '../../objects/map/obstacle/BreakableObstacle';
import { EdgeObstacle } from '../../objects/map/obstacle/EdgeObstacle';
import { FixedObstacle } from '../../objects/map/obstacle/FixedObstacle';
import { GameObject } from '../../objects/GameObject';
import { Ground } from '../../objects/map/Ground';
import { GenericStage } from '../generic/GenericStage';
import { Cell } from 'src/game/types/Cell';

// 草原ステージクラス
export class GrassStage extends GenericStage {
  // 草原ステージ独自の情報
  private info: string = 'Grass everywhere';
  static readonly SPRITE_KEY_MAP = {
    GROUND: {
      FLOWER: Constant.FLOWER,
      GRASS: Constant.GRASS,
    },
    EDGE_OBSTACLE: Constant.WATER,
    FIXED_OBSTACLE: Constant.ROCK,
    BREAKABLE_OBSTACLE: Constant.BOX,
    ATTACK: Constant.ATTACK,
    ITEM: Constant.ITEM,
  };
  static readonly NPC_NAME_ARR: string[] = [
    'Mochi',
    'Nyanko',
    'Maru',
    'Hana',
    'Neko-chan',
    'Sakura',
    'Shiro',
    'Mimi',
    'Tama',
    'Kuro',
    'Hachi',
    'Sora',
    'Chibi',
  ];

  constructor(level: number, eventsGateway: EventsGateway, roomId: string) {
    super('Grass', level, eventsGateway, roomId);
  }

  getInfo(): string {
    return this.info;
  }

  toString(): string {
    return `${super.getType()}\n${this.getInfo()}`;
  }

  protected addGround(map: Cell[][], i: number, j: number) {
    const x: number = i * this.tileSize;
    const y: number = j * this.tileSize;
    const id: number = this.groundManager.getCurrId();
    const grassKeyArr: string[] = GrassStage.SPRITE_KEY_MAP.GROUND.GRASS;
    const flowerKeyMap: {
      WHITE: string;
      RED: string;
    } = GrassStage.SPRITE_KEY_MAP.GROUND.FLOWER;

    let spriteKey: string = '';
    if (i % 2 === 0 && j % 2 === 0) {
      spriteKey = grassKeyArr[MathUtil.getRandomInt(0, grassKeyArr.length - 1)];
    } else {
      const ramdomInt = MathUtil.getRandomInt(0, 4);
      if (ramdomInt <= 0) {
        spriteKey = Object.values(flowerKeyMap)[MathUtil.getRandomInt(0, 1)];
      } else {
        spriteKey =
          grassKeyArr[MathUtil.getRandomInt(0, grassKeyArr.length - 1)];
      }
    }

    if (spriteKey === '') return;

    //Groundを生成
    const ground: Ground = new Ground(id, x, y, spriteKey);
    //GroundManagerに追加
    this.groundManager.getMap().set(id, ground);
    //currIdを更新
    this.groundManager.incrementCurrId();

    //mapに追加
    map[i][j] = {
      entity: null,
      item: null,
    };
  }

  protected addEdgeObstacle(map: Cell[][], i: number, j: number) {
    const x: number = i * this.tileSize;
    const y: number = j * this.tileSize;
    const id: number = this.edgeObstacleManager.getCurrId();
    const spriteKeyArr: string[] = GrassStage.SPRITE_KEY_MAP.EDGE_OBSTACLE;
    const spriteKey =
      spriteKeyArr[MathUtil.getRandomInt(0, spriteKeyArr.length - 1)];

    //EdgeObstacleを生成
    const edgeObstacle = new EdgeObstacle(id, x, y, spriteKey);
    //EdgeObstacleManagerに追加
    this.edgeObstacleManager.getMap().set(id, edgeObstacle);
    //currIdを更新
    this.edgeObstacleManager.incrementCurrId();

    //mapに追加
    map[i][j] = {
      entity: edgeObstacle,
      item: null,
    };
  }
  protected addFixedObstacle(map: Cell[][], i: number, j: number) {
    const x = i * this.tileSize;
    const y = j * this.tileSize;
    const id = this.fixedObstacleManager.getCurrId();
    const spriteKeyArr: string[] = GrassStage.SPRITE_KEY_MAP.FIXED_OBSTACLE;
    const spriteKey =
      spriteKeyArr[MathUtil.getRandomInt(0, spriteKeyArr.length - 1)];

    //FixedObstacleを生成
    const fixedObstacle = new FixedObstacle(id, x, y, spriteKey);
    //FixedObstacleManagerに追加
    this.fixedObstacleManager
      .getMap()
      .set(fixedObstacle.getId(), fixedObstacle);
    //currIdを更新
    this.fixedObstacleManager.incrementCurrId();

    //mapに追加
    map[i][j] = {
      entity: fixedObstacle,
      item: null,
    };
  }
  protected addBreakableObstacle(map: Cell[][], i: number, j: number) {
    const x = i * this.tileSize;
    const y = j * this.tileSize;
    const id = this.breakableObstacleManager.getCurrId();
    const spriteKey: string = GrassStage.SPRITE_KEY_MAP.BREAKABLE_OBSTACLE;

    //BreakableObstacleを生成
    const breakableObstacle = new BreakableObstacle(id, x, y, spriteKey);
    //BreakableObstacleManagerに追加
    this.breakableObstacleManager
      .getMap()
      .set(breakableObstacle.getId(), breakableObstacle);
    //currIdを更新
    this.breakableObstacleManager.incrementCurrId();

    //mapに追加
    map[i][j] = {
      entity: breakableObstacle,
      item: null,
    };
  }
}
