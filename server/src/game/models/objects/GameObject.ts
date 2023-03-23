import Constant from 'src/constant';
import { GameObjectDTO } from 'src/game/dtos/GameObjectDTO';
import { Position } from 'src/game/types/Position';

export abstract class GameObject {
  protected size: number = Constant.TIP_SIZE;

  constructor(
    protected x: number,
    protected y: number,
    protected spriteKey: string,
    protected animation: string,
  ) {}

  public toDTO(): GameObjectDTO {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      spriteKey: this.spriteKey,
      animation: this.animation,
    };
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
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
  }
  public setAnimation(animation: string): void {
    this.animation = animation;
  }
}
