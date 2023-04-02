import { Ground } from '../objects/map/Ground';

export class GroundManager {
  protected currId: number = 0;
  protected map: Map<number, Ground> = new Map<number, Ground>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, Ground> {
    return this.map;
  }

  public incrementCurrId(): void {
    this.currId++;
  }
}
