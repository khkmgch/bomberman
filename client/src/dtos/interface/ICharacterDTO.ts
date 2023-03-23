import { IGameObjectDTO } from './IGameObjectDTO';

export interface ICharacterDTO extends IGameObjectDTO {
  id: number;
  name: string;
  direction: number;
  stock: number;
  initStock: number;
}
