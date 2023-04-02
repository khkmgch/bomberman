import { Character } from '../character/Character';
import { Item } from './Item';

export class HealUp extends Item {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey);
  }
  public doEffect(character: Character): void {
    this.heal(character);
  }
  private heal(character: Character): void {
    const stock: number = character.getStock();
    if (stock >= character.getInitStock()) return;
    character.setHealUp(character.getHealUp() + 1);
    character.setStock(stock + 1);
  }
}
