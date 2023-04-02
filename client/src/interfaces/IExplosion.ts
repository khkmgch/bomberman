import { IExplosionDTO } from '../dtos/interface/IExplosionDTO';
import { IGameObject } from './IGameObject';

export interface IExplosion extends IGameObject {
  sync: IExplosionDTO | null;
}
