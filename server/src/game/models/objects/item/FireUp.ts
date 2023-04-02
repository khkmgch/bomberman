import { Character } from '../character/Character';
import { Item } from './Item';

export class FireUp extends Item {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey);
  }
  public doEffect(character: Character): void {
    this.increaseExplosionRange(character);
  }
  private increaseExplosionRange(character: Character): void {
    const count: number = character.getFireUp();
    if (count >= 10) return;
    character.setFireUp(count + 1);
    character.setExplosionRange(character.getExplosionRange() + 1);
  }
}
