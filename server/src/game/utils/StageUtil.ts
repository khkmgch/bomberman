import Constant from 'src/constant';
import { Index } from '../types/Index';

export class StageUtil {
  static readonly TILE_SIZE = Constant.TILE.SIZE;

  static getMapIndex(x: number, y: number): Index {
    return {
      i: Math.floor(x / StageUtil.TILE_SIZE),
      j: Math.floor(y / StageUtil.TILE_SIZE),
    };
  }
}
