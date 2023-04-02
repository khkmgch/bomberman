import Constant from 'src/constant';
import { GameObjectDTO } from 'src/game/dtos/GameObjectDTO';
import { Index } from 'src/game/types/Index';
import { Position } from 'src/game/types/Position';
import { StageUtil } from 'src/game/utils/StageUtil';

export abstract class GameObject {
  protected size: number = Constant.TIP_SIZE;
  protected i: number;
  protected j: number;

  constructor(
    protected id: number,
    protected x: number,
    protected y: number,
    protected spriteKey: string,
    protected animation: string,
  ) {
    this.setIndex(x, y);
  }

  public toDTO(): GameObjectDTO {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      size: this.size,
      spriteKey: this.spriteKey,
      animation: this.animation,
    };
  }

  public getId(): number {
    return this.id;
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }
  public getIndex(): Index {
    return { i: this.i, j: this.j };
  }
  public getSize(): number {
    return this.size;
  }
  public getAnimation(): string {
    return this.animation;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.setIndex(x, y);
  }
  public setIndex(x: number, y: number): void {
    //現在位置のインデックスを取得
    const { i, j }: Index = StageUtil.getMapIndex(
      x + this.size / 2,
      y + this.size / 2,
    );
    this.i = i;
    this.j = j;
  }
  public setAnimation(animation: string): void {
    this.animation = animation;
  }
}
