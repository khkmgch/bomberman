import { GroundDTO } from 'src/game/dtos/GroundDTO';
import { GameObject } from './GameObject';

export class Ground extends GameObject {
  constructor(private id: number, x: number, y: number, spriteKey: string) {
    super(x, y, spriteKey, `${spriteKey}-anim`);
  }

  public getId(): number {
    return this.id;
  }
  public toDTO(): GroundDTO {
    return Object.assign(super.toDTO(), {
      id: this.id,
    });
  }
}
