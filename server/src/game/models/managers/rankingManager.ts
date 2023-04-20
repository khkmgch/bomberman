import Constant from 'src/constant';
import { Character } from '../objects/character/Character';

export class RankingManager {
  private currId: number = Constant.MAX_PLAYERS_PER_ROOM;
  private map: Map<number, Character> = new Map<number, Character>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, Character> {
    return this.map;
  }
  public decrementCurrId(): void {
    this.currId--;
  }
}
