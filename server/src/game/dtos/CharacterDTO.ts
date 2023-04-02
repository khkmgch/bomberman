import { GameObjectDTO } from './GameObjectDTO';

export abstract class CharacterDTO extends GameObjectDTO {
  public name: string;
  public direction: number;
  public stock: number;
  public initStock: number;
}
