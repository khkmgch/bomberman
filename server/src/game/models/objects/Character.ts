import Constant from 'src/constant';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';
import { Index } from 'src/game/types/Index';
import { Velocity } from 'src/game/types/Velocity';
import { CharacterUtil } from 'src/game/utils/CharacterUtil';
import { StageUtil } from 'src/game/utils/StageUtil';
import { GameObject } from './GameObject';

export abstract class Chatacter extends GameObject {
  protected direction: number = 2;
  protected stock: number = 1;
  protected initStock: number = 1;
  protected speed: number = 150;
  protected velocity: Velocity = { x: 0, y: 0 };

  constructor(
    protected id: number,
    protected name: string,
    x: number,
    y: number,
  ) {
    super(
      x,
      y,
      CharacterUtil.getCatSpriteFromId(id),
      `${CharacterUtil.getCatSpriteFromId(id)}-turn-down`,
    );
  }
  public toDTO(): CharacterDTO {
    return Object.assign(super.toDTO(), {
      id: this.id,
      name: this.name,
      direction: this.direction,
      stock: this.stock,
      initStock: this.initStock,
    });
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getDirection(): number {
    return this.direction;
  }
  public getSpeed(): number {
    return this.speed;
  }
  public getVelocity(): Velocity {
    return this.velocity;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setSpeed(speed: number): void {
    this.speed = speed;
  }
  public setVelocity(x: number, y: number): void {
    this.velocity = { x, y };
  }
  public setDirection(direction: number): void {
    this.direction = direction;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  protected move(deltaTime: number) {
    //現在位置のインデックスを取得
    const { i, j }: Index = StageUtil.getMapIndex(
      this.x + this.size / 2,
      this.y + this.size / 2,
    );

    const tileSize: number = Constant.TILE.SIZE;
    let x: number = this.x;
    let y: number = this.y;
    switch (this.direction) {
      case 0:
      case 2:
        x = i * tileSize;
        y = this.y + this.velocity.y * deltaTime;
        break;
      case 1:
      case 3:
        x = this.x + this.velocity.x * deltaTime;
        y = j * tileSize;
        break;
    }
    //位置を更新
    this.setPosition(x, y);
  }

  //アニメーションを設定するメソッド
  protected animWalkUp() {
    this.animation = `${this.spriteKey}-up`;
  }
  protected animWalkLeft() {
    this.animation = `${this.spriteKey}-left`;
  }
  protected animWalkDown() {
    this.animation = `${this.spriteKey}-down`;
  }
  protected animTurnUp() {
    this.animation = `${this.spriteKey}-turn-up`;
  }
  protected animTurnLeft() {
    this.animation = `${this.spriteKey}-turn-left`;
  }
  protected animTurnDown() {
    this.animation = `${this.spriteKey}-turn-down`;
  }
}
