import { FixedObstacleDTO } from 'src/game/dtos/FixedObstacleDTO';
import { GameObject } from '../../GameObject';

export class FixedObstacle extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey, '');
  }

  public toDTO(): FixedObstacleDTO {
    return super.toDTO();
  }
}
