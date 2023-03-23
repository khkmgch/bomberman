import { GameObjectDTO } from './GameObjectDTO';

export abstract class CharacterDTO extends GameObjectDTO {
  public id: number;
  public name: string;

  public direction: number;
  public stock: number;
  public initStock: number;
  //   constructor(
  //     private id: number,
  //     private name: string,
  //     x: number,
  //     y: number,
  //     size: number,
  //     spriteKey: string,
  //     animation: string,
  //     private direction: number,
  //     private stock: number,
  //     private initStock: number,
  //   ) {
  //     super(x, y, size, spriteKey, animation);
  //   }
}
