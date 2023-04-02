import { Item } from "../objects/item/Item";

export class ItemManager {
    private currId: number = 0;
    private map: Map<number, Item> = new Map<number, Item>();
  
    public getCurrId(): number {
      return this.currId;
    }
    public getMap(): Map<number, Item> {
      return this.map;
    }
    public incrementCurrId(): void {
      this.currId++;
    }
  }