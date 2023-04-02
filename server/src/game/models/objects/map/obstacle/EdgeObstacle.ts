import { EdgeObstacleDTO } from 'src/game/dtos/EdgeObstacleDTO';
import { GameObject } from '../../GameObject';

export class EdgeObstacle extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey, `${spriteKey}-anim`);
  }

  public toDTO(): EdgeObstacleDTO {
    return super.toDTO();
  }
}
