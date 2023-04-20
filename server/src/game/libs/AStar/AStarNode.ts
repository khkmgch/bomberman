import { Cell } from 'src/game/types/Cell';

export class AStarNode {
  private cell: Cell;
  private actualCost: number;
  private heuristicCost: number;
  private prev: AStarNode;

  constructor(cell: Cell) {
    this.cell = cell;
    this.actualCost = Number.MAX_VALUE;
    this.heuristicCost = 0;
    this.prev = null;
  }

  public getCell(): Cell {
    return this.cell;
  }
  public getActualCost(): number {
    return this.actualCost;
  }
  public getHeuristicCost(): number {
    return this.heuristicCost;
  }
  public getPrevNode(): AStarNode {
    return this.prev;
  }
  public setActualCost(actualCost: number): void {
    this.actualCost = actualCost;
  }
  public setHeuristicCost(heuristicCost: number): void {
    this.heuristicCost = heuristicCost;
  }
  public setPrevNode(prevNode: AStarNode): void {
    this.prev = prevNode;
  }
}
