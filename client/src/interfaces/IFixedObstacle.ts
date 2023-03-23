import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IGameObject } from './IGameObject';

export interface IFixedObstacle extends IGameObject {
  sync: IFixedObstacleDTO | null;
}
