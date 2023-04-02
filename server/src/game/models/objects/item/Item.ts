import { ItemDTO } from 'src/game/dtos/ItemDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Index } from 'src/game/types/Index';
import { ItemManager } from '../../managers/ItemManager';
import { Character } from '../character/Character';
import { GameObject } from '../GameObject';

export class Item extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey, '');
  }

  public toDTO(): ItemDTO {
    return super.toDTO();
  }
  public doEffect(character: Character): void {}

  public removeItem(stage: IStage): void {
    const itemManager: ItemManager = stage.getItemManager();

    if (!itemManager.getMap().has(this.id)) return;

    itemManager.getMap().delete(this.id);

    const { i, j }: Index = this.getIndex();
    stage.getMap()[i][j].item = null;

    stage
      .getEventGateway()
      .server.in(stage.getRoomId())
      .emit('RemoveItem', { id: this.id });
  }
}
