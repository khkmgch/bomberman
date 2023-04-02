import { EdgeObstacle } from '../objects/map/obstacle/EdgeObstacle';

export class EdgeObstacleManager {
  protected currId: number = 0;
  protected map: Map<number, EdgeObstacle> = new Map<number, EdgeObstacle>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, EdgeObstacle> {
    return this.map;
  }

  public incrementCurrId(): void {
    this.currId++;
  }
}
