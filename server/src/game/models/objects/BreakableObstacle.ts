import { BreakableObstacleDTO } from 'src/game/dtos/BreakableObstacleDTO';
import { GameObject } from './GameObject';

export class BreakableObstacle extends GameObject {
  constructor(private id: number, x: number, y: number, spriteKey: string) {
    super(x, y, spriteKey, '');
  }

  public getId(): number {
    return this.id;
  }
  public toDTO(): BreakableObstacleDTO {
    return Object.assign(super.toDTO(), {
      id: this.id,
    });
  }
}
