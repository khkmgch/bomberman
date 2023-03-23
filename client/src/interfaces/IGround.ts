import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IGameObject } from './IGameObject';

export interface IGround extends IGameObject {
  sync: IGroundDTO | null;
}
