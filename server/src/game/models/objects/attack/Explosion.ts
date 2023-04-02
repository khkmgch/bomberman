import { ExplosionDTO } from 'src/game/dtos/ExplosionDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Character } from '../character/Character';
import { GameObject } from '../GameObject';

export class Explosion extends GameObject {
  constructor(
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    private character: Character,
    private stage: IStage,
  ) {
    super(id, x, y, spriteKey, `${spriteKey}-anim`);
  }
  public toDTO(): ExplosionDTO {
    return super.toDTO();
  }
}
