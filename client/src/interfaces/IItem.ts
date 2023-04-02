import { IItemDTO } from '../dtos/interface/IItemDTO';
import { IGameObject } from './IGameObject';

export interface IItem extends IGameObject {
  sync: IItemDTO | null;
}
