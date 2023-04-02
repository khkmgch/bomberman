import { GroundDTO } from 'src/game/dtos/GroundDTO';
import { GameObject } from '../GameObject';

export class Ground extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id,x, y, spriteKey, `${spriteKey}-anim`);
  }
  public toDTO(): GroundDTO {
    return super.toDTO()
  }
}
