import { EdgeObstacleDTO } from 'src/game/dtos/EdgeObstacleDTO';
import { GameObject } from './GameObject';

export class EdgeObstacle extends GameObject {
  constructor(private id: number, x: number, y: number, spriteKey: string) {
    super(x, y, spriteKey, `${spriteKey}-anim`);
  }

  public getId(): number {
    return this.id;
  }
  public toDTO(): EdgeObstacleDTO{
    return Object.assign(super.toDTO(), {
      id: this.id,
    });
  }
}
