import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { IGameObject } from './IGameObject';

export interface IBreakableObstacle extends IGameObject {
  sync: IBreakableObstacleDTO | null;
}
