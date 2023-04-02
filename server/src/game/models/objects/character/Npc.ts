import { IStage } from "src/game/interfaces/stage/IStage";
import { Character } from "./Character";

export class Npc extends Character {
    constructor(
      id: number,
      name: string,
      x: number,
      y: number,
      stage: IStage
    ) {
      super(id, name, x, y, stage);
    }
  
  }