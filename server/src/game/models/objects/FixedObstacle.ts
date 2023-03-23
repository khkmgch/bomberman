import { FixedObstacleDTO } from 'src/game/dtos/FixedObstacleDTO';
import { GameObject } from './GameObject';

export class FixedObstacle extends GameObject {
  constructor(private id: number, x: number, y: number, spriteKey: string) {
    super(x, y, spriteKey, '');
  }

  public getId(): number {
    return this.id;
  }
  public toDTO(): FixedObstacleDTO {
    return Object.assign(super.toDTO(), {
      id: this.id,
    });
  }
}
