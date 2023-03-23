import { FixedObstacle } from '../objects/FixedObstacle';

export class FixedObstacleManager {
  protected currId: number = 0;
  protected map: Map<number, FixedObstacle> = new Map<number, FixedObstacle>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, FixedObstacle> {
    return this.map;
  }

  public incrementCurrId(): void {
    this.currId++;
  }
}
