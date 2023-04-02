import { Marker } from "../objects/attack/Marker";

export class MarkerManager {
  private currId: number = 0;
  private map: Map<number, Marker> = new Map<number, Marker>();

  public getCurrId(): number {
    return this.currId;
  }
  public getMap(): Map<number, Marker> {
    return this.map;
  }
  public incrementCurrId(): void {
    this.currId++;
  }
}
