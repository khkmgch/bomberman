import { Chatacter } from "./Character";

export class Npc extends Chatacter {
    constructor(
      id: number,
      name: string,
      x: number,
      y: number,
    ) {
      super(id, name, x, y);
    }
  
  }