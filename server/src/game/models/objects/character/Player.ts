import { Socket } from 'socket.io';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Index } from 'src/game/types/Index';
import { Movement } from 'src/game/types/Movement';
import { Position } from 'src/game/types/Position';
import { Velocity } from 'src/game/types/Velocity';
import { StageUtil } from 'src/game/utils/StageUtil';
import { Bomb } from '../attack/Bomb';
import { BreakableObstacle } from '../map/obstacle/BreakableObstacle';
import { Character } from './Character';
import { EdgeObstacle } from '../map/obstacle/EdgeObstacle';
import { FixedObstacle } from '../map/obstacle/FixedObstacle';
import { Cell } from 'src/game/types/Cell';
import { Item } from '../item/Item';

export class Player extends Character {
  private movement: Movement = {
    up: false,
    right: false,
    down: false,
    left: false,
  };

  constructor(
    id: number,
    private socket: Socket,
    name: string,
    x: number,
    y: number,
    stage: IStage,
  ) {
    super(id, name, x, y, stage);
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getSocket(): Socket {
    return this.socket;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setMovement(movement: Movement): void {
    this.movement = movement;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public update(deltaTime: number, stage: IStage): void {
    //movementにtrueの値がない（動作がない）場合
    if (!Object.values(this.movement).some((value) => value)) {
      this.setVelocity(0, 0);

      switch (this.direction) {
        case 0:
          this.animTurnUp();
          break;
        case 1:
          this.animTurnLeft();
          break;
        case 2:
          this.animTurnDown();
          break;
        case 3:
          this.animTurnLeft();
          break;
      }
    }

    // movementによって、プレイヤーの向きと位置を更新
    if (this.movement.up) {
      this.setDirection(0);
      this.setVelocity(0, -this.ability.speed);
      this.animWalkUp();
    }
    if (this.movement.right) {
      this.setDirection(1);
      this.setVelocity(this.ability.speed, 0);
      this.animWalkLeft();
    }
    if (this.movement.down) {
      this.setDirection(2);
      this.setVelocity(0, this.ability.speed);
      this.animWalkDown();
    }
    if (this.movement.left) {
      this.setDirection(3);
      this.setVelocity(-this.ability.speed, 0);
      this.animWalkLeft();
    }

    if (this.canMove(stage.getMap(), deltaTime)) {
      this.move(deltaTime);
    }
    if (this.overlapWithExplosion(stage.getMap())) {
      this.takeDamage();
    }
    const item: Item = this.overlapWithItem(stage.getMap());

    if (item) {
      item.doEffect(this);
      item.removeItem(stage);
      this.emitSyncItems();
    }
  }
  private emitSyncItems(): void {
    this.socket.emit('SyncItems', {
      items: this.item,
    });
  }

  private canMove(map: Cell[][], deltaTime: number): boolean {
    return (
      !this.collideWithBomb(map, deltaTime) &&
      !this.collideWithObstacle(map, deltaTime)
    );
  }
  //障害物との当たり判定
  private collideWithObstacle(map: Cell[][], deltaTime: number): boolean {
    const cell: Cell = this.getNextCell(map, deltaTime);
    return (
      cell.entity instanceof EdgeObstacle ||
      cell.entity instanceof FixedObstacle ||
      cell.entity instanceof BreakableObstacle
    );
  }
  //Bombとの当たり判定
  private collideWithBomb(map: Cell[][], deltaTime: number): boolean {
    //現在のマスのインデックス
    const { i: currI, j: currJ }: Index = this.getIndex();
    //現在のマス
    const currCell: Cell = map[currI][currJ];
    if (currCell.entity === null || currCell.entity === undefined) {
      const nextCell: Cell = this.getNextCell(map, deltaTime);
      return nextCell.entity instanceof Bomb;
    } else if (currCell.entity instanceof Bomb) {
      //Bombと同じマスにいる場合

      const { i: nextI, j: nextJ }: Index = this.getNextIndex(deltaTime);
      //移動先の座標のインデックスが現在のインデックスと同じ場合
      if (nextI === currI && nextJ === currJ) return false;

      const nextCell: Cell = map[nextI][nextJ];
      if (nextCell.entity instanceof Bomb) return true;
      else return false;
    } else return false;
  }
  //移動先のマスを返すメソッド
  private getNextCell(map: Cell[][], deltaTime: number): Cell {
    const { i, j }: Index = this.getNextIndex(deltaTime);
    return map[i][j];
  }
  //移動先の位置のインデックスを返すメソッド
  private getNextIndex(deltaTime: number): Index {
    let { x: nextX, y: nextY }: Position = this.getPosition();
    const { x: vX, y: vY }: Velocity = this.velocity;
    switch (this.direction) {
      case 0:
        nextX += this.size / 2;
        nextY += vY * deltaTime;
        break;
      case 1:
        nextX += vX * deltaTime + this.size;
        nextY += this.size / 2;
        break;
      case 2:
        nextX += this.size / 2;
        nextY += vY * deltaTime + this.size;
        break;
      case 3:
        nextX += vX * deltaTime;
        nextY += this.size / 2;
        break;
    }
    return StageUtil.getMapIndex(nextX, nextY);
  }
}
