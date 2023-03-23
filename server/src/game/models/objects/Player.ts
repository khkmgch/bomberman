import { Socket } from 'socket.io';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Index } from 'src/game/types/Index';
import { Movement } from 'src/game/types/Movement';
import { Position } from 'src/game/types/Position';
import { Velocity } from 'src/game/types/Velocity';
import { StageUtil } from 'src/game/utils/StageUtil';
import { BreakableObstacle } from './BreakableObstacle';
import { Chatacter } from './Character';
import { EdgeObstacle } from './EdgeObstacle';
import { FixedObstacle } from './FixedObstacle';
import { GameObject } from './GameObject';

export class Player extends Chatacter {
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
  ) {
    super(id, name, x, y);
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
      this.setVelocity(0, -this.speed);
      this.animWalkUp();
    }
    if (this.movement.right) {
      this.setDirection(1);
      this.setVelocity(this.speed, 0);
      this.animWalkLeft();
    }
    if (this.movement.down) {
      this.setDirection(2);
      this.setVelocity(0, this.speed);
      this.animWalkDown();
    }
    if (this.movement.left) {
      this.setDirection(3);
      this.setVelocity(-this.speed, 0);
      this.animWalkLeft();
    }

    if (this.canMove(stage.getMap(), deltaTime)) {
      this.move(deltaTime);
    }
  }

  private canMove(map: GameObject[][], deltaTime: number): boolean {
    return !this.collideWithObject(map, deltaTime);
  }
  private collideWithObject(map: GameObject[][], deltaTime: number): boolean {
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
    const { i, j }: Index = StageUtil.getMapIndex(nextX, nextY);
    const object: GameObject = map[i][j];
    return (
      object instanceof EdgeObstacle ||
      object instanceof FixedObstacle ||
      object instanceof BreakableObstacle
    );
  }
  // let boundX: number = this.x;
  //   let boundY: number = this.y;
  //   let i: number;
  //   let j: number;
  //   let stageValue: number;

  //   if (this.direction === "up") {
  //     boundY -= this.speed;
  //     i = Math.floor(boundY / Stage.boxSize);
  //     j = Math.floor((boundX + this.size / 2) / Stage.boxSize);
  //     stageValue = board[i][j];
  //   } else if (this.direction === "down") {
  //     boundY += this.speed + this.size;
  //     i = Math.floor(boundY / Stage.boxSize);
  //     j = Math.floor((boundX + this.size / 2) / Stage.boxSize);
  //     stageValue = board[i][j];
  //   } else if (this.direction === "left") {
  //     boundX -= this.speed;
  //     i = Math.floor((boundY + this.size / 2) / Stage.boxSize);
  //     j = Math.floor(boundX / Stage.boxSize);
  //     stageValue = board[i][j];
  //   } else if (this.direction === "right") {
  //     boundX += this.speed + this.size;
  //     i = Math.floor((boundY + this.size / 2) / Stage.boxSize);
  //     j = Math.floor(boundX / Stage.boxSize);
  //     stageValue = board[i][j];
  //   }
  //   return (
  //     stageValue === Stage.stageValues.stone ||
  //     stageValue === Stage.stageValues.wall ||
  //     stageValue === Stage.stageValues.bomb
  //     //&& !this.isOnTheBomb(board))
  //   );
}
