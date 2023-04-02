import Constant from 'src/constant';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Cell } from 'src/game/types/Cell';
import { Index } from 'src/game/types/Index';
import { Position } from 'src/game/types/Position';
import { Velocity } from 'src/game/types/Velocity';
import { CharacterUtil } from 'src/game/utils/CharacterUtil';
import { GrassStage } from '../../stages/grass/GrassStage';
import { Bomb } from '../attack/Bomb';
import { Explosion } from '../attack/Explosion';
import { GameObject } from '../GameObject';
import { Item } from '../item/Item';

export abstract class Character extends GameObject {
  protected item: {
    fireUp: number;
    bombUp: number;
    speedUp: number;
    healUp: number;
  } = {
    fireUp: 0,
    bombUp: 0,
    speedUp: 0,
    healUp: 0,
  };
  protected ability: {
    stock: number;
    initStock: number;
    explosionRange: number;
    bombLimit: number;
    speed: number;
  } = {
    stock: 3,
    initStock: 3,
    explosionRange: 1,
    bombLimit: 1,
    speed: 100,
  };
  protected direction: number = 2;
  protected velocity: Velocity = { x: 0, y: 0 };
  protected invincible: boolean = false;
  protected isAlive: boolean = true;
  protected bombMap: Map<number, Bomb> = new Map<number, Bomb>();

  constructor(
    id: number,
    protected name: string,
    x: number,
    y: number,
    protected stage: IStage,
  ) {
    super(
      id,
      x,
      y,
      CharacterUtil.getCatSpriteFromId(id),
      `${CharacterUtil.getCatSpriteFromId(id)}-turn-down`,
    );
  }
  public toDTO(): CharacterDTO {
    return Object.assign(super.toDTO(), {
      name: this.name,
      direction: this.direction,
      stock: this.ability.stock,
      initStock: this.ability.initStock,
    });
  }

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getFireUp(): number {
    return this.item.fireUp;
  }
  public getBombUp(): number {
    return this.item.bombUp;
  }
  public getSpeedUp(): number {
    return this.item.speedUp;
  }
  public getHealUp(): number {
    return this.item.healUp;
  }
  public getStock(): number {
    return this.ability.stock;
  }
  public getInitStock(): number {
    return this.ability.initStock;
  }
  public getExplosionRange(): number {
    return this.ability.explosionRange;
  }
  public getBombLimit(): number {
    return this.ability.bombLimit;
  }
  public getSpeed(): number {
    return this.ability.speed;
  }
  public getDirection(): number {
    return this.direction;
  }
  public getVelocity(): Velocity {
    return this.velocity;
  }
  public getIsAlive(): boolean {
    return this.isAlive;
  }
  public getBombMap(): Map<number, Bomb> {
    return this.bombMap;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setFireUp(count: number): void {
    this.item.fireUp = count;
  }
  public setBombUp(count: number): void {
    this.item.bombUp = count;
  }
  public setSpeedUp(count: number): void {
    this.item.speedUp = count;
  }
  public setHealUp(count: number): void {
    this.item.healUp = count;
  }
  public setSpeed(speed: number): void {
    this.ability.speed = speed;
  }
  public setStock(stock: number): void {
    this.ability.stock = stock;
  }
  public setExplosionRange(range: number): void {
    this.ability.explosionRange = range;
  }
  public setBombLimit(limit: number): void {
    this.ability.bombLimit = limit;
  }
  public setDirection(direction: number): void {
    this.direction = direction;
  }
  public setVelocity(x: number, y: number): void {
    this.velocity = { x, y };
  }
  public setInvincible(invincible: boolean): void {
    this.invincible = invincible;
  }
  public setIsAlive(isAlive: boolean): void {
    this.isAlive = isAlive;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  protected move(deltaTime: number) {
    //現在位置のインデックスを取得
    const { i, j }: Index = this.getIndex();

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

  public putBomb(): void {
    if (this.bombMap.size >= this.ability.bombLimit) return;

    const bombManager = this.stage.getBombManager();
    const id = bombManager.getCurrId();
    bombManager.incrementCurrId();

    const { i, j }: Index = this.getIndex();
    const { x, y }: Position = {
      x: i * this.stage.getTileSize(),
      y: j * this.stage.getTileSize(),
    };

    const bomb: Bomb = new Bomb(
      id,
      x,
      y,
      GrassStage.SPRITE_KEY_MAP.ATTACK.BOMB,
      this,
      this.stage,
    );
    //ステージマップに追加
    this.stage.getMap()[i][j].entity = bomb;
    //bombManagerに追加
    bombManager.getMap().set(id, bomb);
    //bombMapに追加
    this.bombMap.set(id, bomb);
  }
  // 爆風との当たり判定を行うメソッド
  protected overlapWithExplosion(map: Cell[][]): boolean {
    //現在のマスのインデックス
    const { i: currI, j: currJ }: Index = this.getIndex();
    //現在のマス
    const currCell: Cell = map[currI][currJ];
    return currCell.entity instanceof Explosion;
  }
  //アイテムとの当たり判定を行うメソッド
  protected overlapWithItem(map: Cell[][]): Item {
    const { i: currI, j: currJ }: Index = this.getIndex();
    //現在のマス
    const currCell: Cell = map[currI][currJ];
    return currCell.item;
  }

  // ダメージを受けるメソッド
  protected takeDamage(): void {
    // ダメージ処理
    if (!this.invincible) {
      // 無敵状態でない場合にダメージを受ける
      this.decrementStock();
      this.setInvincible(true); // 無敵状態にする
      this.emitDamaged();
      if (this.ability.stock <= 0) {
        this.setIsAlive(false);
        setTimeout(() => {
          this.emitDead();
        }, Constant.INVINCIBLE_DURATION);
      } else {
        setTimeout(() => {
          // 一定時間後に無敵状態を解除する
          this.setInvincible(false);
        }, Constant.INVINCIBLE_DURATION); // 3000ミリ秒（＝3秒）間無敵状態にする
      }
    }
  }
  private emitDamaged(): void {
    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('Damaged', { id: this.id });
  }

  private decrementStock(): void {
    this.ability.stock--;
  }
  private emitDead(): void {
    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('Dead', { id: this.id });
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
