import { Socket } from 'socket.io';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Index } from 'src/game/types/Index';
import { Movement } from 'src/game/types/Movement';
import { Character } from './Character';
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

  public update(deltaTime: number): void {
    //movementにtrueの値がない（動作がない）場合
    if (!Object.values(this.movement).some((value) => value)) {
      this.stay();
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

    if (this.canMove(this.stage.getMap(), deltaTime)) {
      this.move(deltaTime);
    }
    if (this.overlapWithExplosion(this.stage.getMap())) {
      this.takeDamage();
    }
    const item: Item = this.overlapWithItem(this.stage.getMap());

    if (item) {
      item.doEffect(this);
      item.removeItem(this.stage);
      this.emitSyncItems();
    }
  }
  private emitSyncItems(): void {
    this.socket.emit('SyncItems', {
      items: this.item,
    });
  }
}
