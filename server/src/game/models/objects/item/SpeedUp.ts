import { Character } from '../character/Character';
import { Item } from './Item';

export class SpeedUp extends Item {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey);
  }
  public doEffect(character: Character): void {
    this.increaseSpeed(character);
  }
  private increaseSpeed(character: Character): void {
    const count: number = character.getSpeedUp();
    if (count >= 10) return;
    character.setSpeedUp(count + 1);
    character.setSpeed(character.getSpeed() + 20);
  }
}
