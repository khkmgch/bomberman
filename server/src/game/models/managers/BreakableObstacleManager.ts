import { BreakableObstacle } from '../objects/BreakableObstacle';

export class BreakableObstacleManager {
  private currId: number = 0;
  private map: Map<number, BreakableObstacle> = new Map<
    number,
    BreakableObstacle
  >();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, BreakableObstacle> {
    return this.map;
  }

  public incrementCurrId(): void {
    this.currId++;
  }
}
