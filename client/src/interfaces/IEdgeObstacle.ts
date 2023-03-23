import { IEdgeObstacleDTO } from "../dtos/interface/IEdgeObstacleDTO";
import { IGameObject } from "./IGameObject";

export interface IEdgeObstacle extends IGameObject {
    sync: IEdgeObstacleDTO | null;
  }