import { BreakableObstacleDTO } from 'src/game/dtos/BreakableObstacleDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { ItemManager } from 'src/game/models/managers/ItemManager';
import { GrassStage } from 'src/game/models/stages/grass/GrassStage';
import { GameObject } from '../../GameObject';
import { BombUp } from '../../item/BombUp';
import { FireUp } from '../../item/FireUp';
import { HealUp } from '../../item/HealUp';
import { Item } from '../../item/Item';
import { SpeedUp } from '../../item/SpeedUp';

export class BreakableObstacle extends GameObject {
  constructor(id: number, x: number, y: number, spriteKey: string) {
    super(id, x, y, spriteKey, '');
  }

  public toDTO(): BreakableObstacleDTO {
    return super.toDTO();
  }
  public spawnItem(stage: IStage): Item {
    let item: Item = null;
    const itemManager: ItemManager = stage.getItemManager();
    const id: number = itemManager.getCurrId();
    itemManager.incrementCurrId();

    const probability: number = Math.random() * 100;
    switch (true) {
      case probability < 30:
        item = new FireUp(
          id,
          this.x,
          this.y,
          GrassStage.SPRITE_KEY_MAP.ITEM.FIRE,
        );
        break;
      case probability < 60:
        item = new BombUp(
          id,
          this.x,
          this.y,
          GrassStage.SPRITE_KEY_MAP.ITEM.BOMB,
        );
        break;
      case probability < 90:
        item = new SpeedUp(
          id,
          this.x,
          this.y,
          GrassStage.SPRITE_KEY_MAP.ITEM.SPEED,
        );
        break;
      default:
        item = new HealUp(
          id,
          this.x,
          this.y,
          GrassStage.SPRITE_KEY_MAP.ITEM.HEAL,
        );
        break;
    }
    itemManager.getMap().set(id, item);
    return item;
  }
}
