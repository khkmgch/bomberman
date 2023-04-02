import { Explosion } from '../objects/attack/Explosion';

export class ExplosionManager {
  private currId: number = 0;
  private map: Map<number, Explosion> = new Map<number, Explosion>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, Explosion> {
    return this.map;
  }
  public incrementCurrId(): void {
    this.currId++;
  }
}
