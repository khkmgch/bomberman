import { IMarkerDTO } from '../dtos/interface/IMarkerDTO';
import { IGameObject } from './IGameObject';

export interface IMarker extends IGameObject {
  sync: IMarkerDTO | null;
}
