import { IGameObjectDTO } from './IGameObjectDTO';

export interface ICharacterDTO extends IGameObjectDTO {
  name: string;
  direction: number;
  stock: number;
  initStock: number;
}
