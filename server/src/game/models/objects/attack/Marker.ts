import { MarkerDTO } from 'src/game/dtos/MarkerDTO';
import { GameObject } from '../GameObject';

export class Marker extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey, '');
  }
  public toDTO(): MarkerDTO {
    return super.toDTO();
  }
}
