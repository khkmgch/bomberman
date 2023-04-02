import { Character } from '../character/Character';
import { Item } from './Item';

export class BombUp extends Item {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey);
  }
  public doEffect(character: Character): void {
    this.increaseBombLimit(character);
  }
  private increaseBombLimit(character: Character): void {
    const count: number = character.getBombUp();
    if (count >= 10) return;
    character.setBombUp(count + 1);
    character.setBombLimit(character.getBombLimit() + 1);
  }
}
