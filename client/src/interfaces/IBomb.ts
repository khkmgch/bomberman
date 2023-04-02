import { IBombDTO } from '../dtos/interface/IBombDTO';
import { IGameObject } from './IGameObject';

export interface IBomb extends IGameObject {
  sync: IBombDTO | null;
}
