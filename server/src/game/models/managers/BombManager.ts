import { Bomb } from "../objects/attack/Bomb";

export class BombManager {
  private currId: number = 0;
  private map: Map<number, Bomb> = new Map<number, Bomb>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, Bomb> {
    return this.map;
  }
  public incrementCurrId(): void {
    this.currId++;
  }
}
