import { IStage } from 'src/game/interfaces/stage/IStage';
import { Character } from './Character';
import { Index } from 'src/game/types/Index';
import { Item } from '../item/Item';
import { Cell } from 'src/game/types/Cell';
import { PriorityQueue } from 'src/game/libs/PriorityQueue/PriorityQueue';
import { AStarNode } from 'src/game/libs/AStar/AStarNode';
import { HeapNode } from 'src/game/libs/PriorityQueue/types/HeapNode';
import { Player } from './Player';
import { FixedObstacle } from '../map/obstacle/FixedObstacle';
import { BreakableObstacle } from '../map/obstacle/BreakableObstacle';
import { EdgeObstacle } from '../map/obstacle/EdgeObstacle';
import { Position } from 'src/game/types/Position';
import Constant from 'src/constant';
import { Bomb } from '../attack/Bomb';
import { MathUtil } from 'src/game/utils/MathUtil';

export class Npc extends Character {
  private movableArea: Index[];
  private impactMaps: {
    curr: number[][];
    forGetItem: number[][];
    forAttackCharacter: number[][];
    forBreakObstacle: number[][];
    forAvoidExplosion: number[][];
    withItem: number[][];
    withExplosion: number[][];
    withObstacle: number[][];
    withCharacter: number[][];
  } = {
    curr: [],
    forGetItem: [],
    forAttackCharacter: [],
    forBreakObstacle: [],
    forAvoidExplosion: [],
    withItem: [],
    withExplosion: [],
    withObstacle: [],
    withCharacter: [],
  };
  private foundItems: Item[] = [];
  private foundCharacters: Character[];
  private action:
    | 'GET_ITEM'
    | 'ATTACK_CHARACTER'
    | 'BREAK_OBSTACLE'
    | 'AVOID_EXPLOSION'
    | '' = '';
  private target: {
    forGetItem: { item: Item };

    forAttackCharacter: { character: Character };

    forBreakObstacle: { cell: Cell };

    forAvoidExplosion: { cell: Cell };
  } = {
    forGetItem: { item: null },
    forAttackCharacter: { character: null },
    forBreakObstacle: { cell: null },
    forAvoidExplosion: { cell: null },
  };
  private routes: {
    curr: Cell[];
    forGetItem: Cell[];
    forAttackCharacter: Cell[];
    forBreakObstacle: Cell[];
  } = {
    curr: [],
    forGetItem: [],
    forAttackCharacter: [],
    forBreakObstacle: [],
  };

  constructor(id: number, name: string, x: number, y: number, stage: IStage) {
    super(id, name, x, y, stage);
  }
  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  public getCurrImpactMap(): number[][] {
    return this.impactMaps.curr;
  }
  public getImpactMapWithItem(): number[][] {
    return this.impactMaps.withItem;
  }
  public getImpactMapWithExplosion(): number[][] {
    return this.impactMaps.withExplosion;
  }
  public getImpactMapWithObstacle(): number[][] {
    return this.impactMaps.withObstacle;
  }
  public getImpactMapWithCharacter(): number[][] {
    return this.impactMaps.withCharacter;
  }

  public getImpactMapForGetItem(): number[][] {
    return this.impactMaps.forGetItem;
  }
  public getImpactMapForBreakObstacle(): number[][] {
    return this.impactMaps.forBreakObstacle;
  }
  public getImpactMapForAvoidExplosion(): number[][] {
    return this.impactMaps.forAvoidExplosion;
  }
  public getImpactMapForAttackCharacter(): number[][] {
    return this.impactMaps.forAttackCharacter;
  }
  public getCurrRoute(): Cell[] {
    return this.routes.curr;
  }
  public getRouteForGetItem(): Cell[] {
    return this.routes.forGetItem;
  }
  public getRouteForAttackCharacter(): Cell[] {
    return this.routes.forAttackCharacter;
  }
  public getRouteForBreakObstacle(): Cell[] {
    return this.routes.forBreakObstacle;
  }
  public getTargetForGetItem(): {
    item: Item;
  } {
    return this.target.forGetItem;
  }
  public getTargetForAttackCharacter(): {
    character: Character;
  } {
    return this.target.forAttackCharacter;
  }
  public getTargetForBreakObstacle(): {
    cell: Cell;
  } {
    return this.target.forBreakObstacle;
  }
  public getTargetForAvoidExplosion(): { cell: Cell } {
    return this.target.forAvoidExplosion;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public setMovableArea(area: Index[]): void {
    this.movableArea = area;
  }
  public setCurrImpactMap(impactMap: number[][]): void {
    this.impactMaps.curr = impactMap;
  }
  public setImpactMapWithItem(impactMapWithItem: number[][]): void {
    this.impactMaps.withItem = impactMapWithItem;
  }
  public setImpactMapWithExplosion(impactMapWithExplosion: number[][]): void {
    this.impactMaps.withExplosion = impactMapWithExplosion;
  }
  public setImpactMapWithObstacle(impactMapWithObstacle: number[][]): void {
    this.impactMaps.withObstacle = impactMapWithObstacle;
  }
  public setImpactMapWithCharacter(impactMapWithCharacter: number[][]): void {
    this.impactMaps.withCharacter = impactMapWithCharacter;
  }

  public setImpactMapForGetItem(impactMapForGetItem: number[][]): void {
    this.impactMaps.forGetItem = impactMapForGetItem;
  }
  public setImpactMapForBreakObstacle(
    impactMapForBreakObstacle: number[][],
  ): void {
    this.impactMaps.forBreakObstacle = impactMapForBreakObstacle;
  }
  public setImpactMapForAvoidExplosion(
    impactMapForAvoidExplosion: number[][],
  ): void {
    this.impactMaps.forAvoidExplosion = impactMapForAvoidExplosion;
  }
  public setImpactMapForAttackCharacter(
    impactMapForAttackCharacter: number[][],
  ): void {
    this.impactMaps.forAttackCharacter = impactMapForAttackCharacter;
  }
  public setFoundItems(items: Item[]): void {
    this.foundItems = items;
  }
  public setFoundCharacters(characters: Character[]): void {
    this.foundCharacters = characters;
  }

  public setAction(
    action:
      | ''
      | 'GET_ITEM'
      | 'ATTACK_CHARACTER'
      | 'BREAK_OBSTACLE'
      | 'AVOID_EXPLOSION',
  ): void {
    this.action = action;
  }
  public setTargetForGetItem(target: { item: Item }): void {
    this.target.forGetItem = target;
  }
  public setTargetForAttackCharacter(target: { character: Character }): void {
    this.target.forAttackCharacter = target;
  }
  public setTargetForBreakObstacle(target: { cell: Cell }): void {
    this.target.forBreakObstacle = target;
  }
  public setTargetForAvoidExplosion(target: { cell: Cell }): void {
    this.target.forAvoidExplosion = target;
  }
  public setCurrRoute(route: Cell[]): void {
    this.routes.curr = route;
  }
  public setRouteForGetItem(routeForGetItem: Cell[]): void {
    this.routes.forGetItem = routeForGetItem;
  }
  public setRouteForAttackCharacter(routeForAttackCharacter: Cell[]): void {
    this.routes.forAttackCharacter = routeForAttackCharacter;
  }
  public setRouteForBreakObstacle(routeForBreakObstacle: Cell[]): void {
    this.routes.forBreakObstacle = routeForBreakObstacle;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public update(deltaTime: number): void {
    const map: Cell[][] = this.stage.getMap();
    /* 当たり判定 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    //爆風との当たり判定
    if (this.overlapWithExplosion(map)) {
      this.takeDamage();
    }

    //アイテムとの当たり判定
    const item: Item = this.overlapWithItem(map);
    if (item) {
      item.doEffect(this);
      item.removeItem(this.stage);
    }

    // 移動可能なマスを更新する。近くにアイテムやプレイヤーがいればその情報を取得する
    this.updateMovableArea();

    this.updateImpactMapWithExplosion();

    if (!(this.actionExists() && this.targetExists())) {
      // ターゲットと行動が設定されていない場合
      this.updateImpactMapWithItem();
      this.updateImpactMapWithObstacle();
      this.updateImpactMapWithCharacter();
      this.updateImpactMapForGetItem();
      this.updateImpactMapForBreakObstacle();
      this.updateImpactMapForAttackCharacter();

      //ターゲットと行動を設定する
      this.updateAction();
    } else if (this.hasReachedTargetCell()) {
      // ターゲットマスに到達した場合
      if (
        this.action === 'ATTACK_CHARACTER' ||
        this.action === 'BREAK_OBSTACLE'
      ) {
        if (this.canAvoidExplosionAfterPutBomb()) {
          this.putBomb();
        }
      }
      this.resetTarget();
      this.resetAction();
      this.setCurrRoute([]);

      this.updateAction();
    }

    this.updateImpactMapForAvoidExplosion();
    //爆風が予想されるマスにいる場合は、行動を回避に設定
    if (this.isExplosionExpected()) {
      this.setAction('AVOID_EXPLOSION');
      this.setCurrImpactMap(this.getImpactMapForAvoidExplosion());
      const forAvoidExplosion: {
        route: Cell[];
        target: Cell;
      } = this.createRouteForAvoidExplosion(
        this.getImpactMapForAvoidExplosion(),
      );
      if (forAvoidExplosion.route.length > 0 && forAvoidExplosion.target) {
        this.setTargetForAvoidExplosion({
          cell: forAvoidExplosion.target,
        });
        this.setCurrRoute(forAvoidExplosion.route);
      } else {
        this.setTargetForAvoidExplosion({
          cell: null,
        });
        this.setCurrRoute([]);
      }
    } else {
      switch (this.action) {
        case 'GET_ITEM':
          //ステージからアイテムに関する影響マップを取得して更新する。(moveableAreaの範囲のみ)
          this.updateImpactMapWithItem();
          this.updateImpactMapForGetItem();
          this.setCurrImpactMap(this.getImpactMapForGetItem());

          const targetForGetItem: { item: Item } = this.getTargetForGetItem();
          const item: Item = targetForGetItem.item;
          const { i, j }: Index = item.getIndex();
          const cell: Cell = map[i][j];
          if (!cell.item) {
            //アイテムがなくなったということなので、ターゲットを再設定する
            this.resetTarget();
            this.resetAction();
            return;
          }
          break;
        case 'ATTACK_CHARACTER':
          this.updateImpactMapWithCharacter();
          this.updateImpactMapForAttackCharacter();
          this.setCurrImpactMap(this.getImpactMapForAttackCharacter());

          const targetForAttackCharacter: { character: Character } =
            this.getTargetForAttackCharacter();
          const character: Character = targetForAttackCharacter.character;
          if (!character.getIsAlive()) {
            this.resetTarget();
            this.resetAction();
          }
          break;
        case 'BREAK_OBSTACLE':
          this.updateImpactMapWithObstacle();
          this.updateImpactMapForBreakObstacle();
          this.setCurrImpactMap(this.getImpactMapForBreakObstacle());

          if (this.stage.getBreakableObstacleManager().getMap().size <= 0) {
            this.resetTarget();
            this.resetAction();
          }

          break;
      }
      this.updateRoute();
    }

    let currRoute: Cell[] = this.getCurrRoute();
    // console.log('this.action', this.action);
    // console.log('currRoute', currRoute);

    if (currRoute && currRoute.length > 0) {
      const { i, j }: Index = this.getIndex();
      let nextCell: Cell = currRoute[currRoute.length - 1];
      let { i: nextI, j: nextJ }: Index = nextCell.index;
      if (i === nextI && j === nextJ) {
        currRoute.pop();
      }
    }

    if (!currRoute || currRoute.length <= 0) {
      //動かない場合
      this.stay();
      this.resetAction();
      this.resetTarget();
    } else {
      const { x, y }: Position = this.getPosition();
      const { i: prevI, j: prevJ }: Index = this.getIndex();

      let nextCell = currRoute[currRoute.length - 1];
      const { i: nextI, j: nextJ }: Index = nextCell.index;

      if (
        this.getImpactMapForAvoidExplosion()[prevI][prevJ] === 0 &&
        this.getImpactMapForAvoidExplosion()[nextI][nextJ] === 1
      ) {
        //動かない場合
        this.stay();
        this.resetAction();
        this.resetTarget();
        return;
      }

      const nextX: number = nextI * Constant.TILE.SIZE;
      const nextY: number = nextJ * Constant.TILE.SIZE;
      const dx: number = nextX - x;
      const dy: number = nextY - y;

      if (Math.abs(dy) >= Math.abs(dx)) {
        if (dy < 0) {
          this.setDirection(0);
          this.setVelocity(0, -this.ability.speed);
          this.animWalkUp();
        } else if (dy > 0) {
          this.setDirection(2);
          this.setVelocity(0, this.ability.speed);
          this.animWalkDown();
        }
      } else {
        if (dx > 0) {
          this.setDirection(1);
          this.setVelocity(this.ability.speed, 0);
          this.animWalkLeft();
        } else if (dx < 0) {
          this.setDirection(3);
          this.setVelocity(-this.ability.speed, 0);
          this.animWalkLeft();
        }
      }

      if (this.canMove(map, deltaTime)) {
        this.move(deltaTime);
      }
    }
  }

  private updateRoute(): void {
    //A*アルゴリズムで最適な経路を求める

    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    const { i, j }: Index = this.getIndex();
    const startCell: Cell = map[i][j];
    const startNode: AStarNode = new AStarNode(startCell);
    startNode.setActualCost(0);
    // console.log('this.impactMap : ', this.impactMap);
    if (!this.getCurrImpactMap() || this.getCurrImpactMap().length <= 0) return;
    //影響マップの値
    const valueOfImpactMap: number = this.getCurrImpactMap()[i][j];

    let targetCell: Cell = null;
    switch (this.action) {
      case 'GET_ITEM':
        const targetForGetItem: {
          item: Item;
        } = this.getTargetForGetItem();
        const item: Item = targetForGetItem.item;
        const { i: itemI, j: itemJ }: Index = item.getIndex();
        targetCell = map[itemI][itemJ];
        break;
      case 'ATTACK_CHARACTER':
        const targetForAttackCharacter: {
          character: Character;
        } = this.getTargetForAttackCharacter();
        const character = targetForAttackCharacter.character;
        const { i, j }: Index = character.getIndex();
        targetCell = map[i][j];
        break;
      case 'BREAK_OBSTACLE':
        const targetForBreakObstacle: {
          cell: Cell;
        } = this.getTargetForBreakObstacle();
        targetCell = targetForBreakObstacle.cell;
        break;
      case 'AVOID_EXPLOSION':
        const targetForAvoidExplosion: { cell: Cell } =
          this.getTargetForAvoidExplosion();
        targetCell = targetForAvoidExplosion.cell;
        break;
    }

    // console.log('action: ', this.action);
    // console.log('targetCell', targetCell);
    if (!targetCell) {
      this.setCurrRoute([]);
      return;
    }
    const { i: targetI, j: targetJ }: Index = targetCell.index;
    //マンハッタン距離
    const manhattanDistance: number =
      Math.abs(i - targetI) + Math.abs(j - targetJ);
    startNode.setHeuristicCost(valueOfImpactMap + manhattanDistance);

    //探索済みのノードを格納するMap
    //keyは(id = i + map.length * j)
    let searchedNodeMap: Map<number, AStarNode> = new Map<number, AStarNode>();
    //スタートノードを追加
    const key: number = i + map.length * j;
    searchedNodeMap.set(key, startNode);

    const comparator: (
      a: HeapNode<AStarNode>,
      b: HeapNode<AStarNode>,
    ) => boolean = (a: HeapNode<AStarNode>, b: HeapNode<AStarNode>) => {
      return (
        a.data.getActualCost() + a.data.getHeuristicCost() <
        b.data.getActualCost() + b.data.getHeuristicCost()
      );
    };

    //優先度付きキュー
    const queue: PriorityQueue<AStarNode> = new PriorityQueue<AStarNode>(
      [{ data: startNode, priority: valueOfImpactMap + manhattanDistance }],
      comparator,
    );

    //経路
    let route: Cell[] = [];

    while (!queue.isEmpty()) {
      const currHeapNode: HeapNode<AStarNode> = queue.pop();
      const currNode: AStarNode = currHeapNode.data;
      const currCell: Cell = currNode.getCell();
      const { i, j }: Index = currCell.index;

      //目標のマスに到達した時
      if (i === targetI && j === targetJ) {
        let node: AStarNode = currNode;
        while (node.getPrevNode() !== null) {
          route.push(node.getCell());
          node = node.getPrevNode();
        }

        break;
      }

      for (const [offsetI, offsetJ] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nextI: number = i + offsetI;
        const nextJ: number = j + offsetJ;
        const key: number = nextI + map.length * nextJ;
        if (searchedNodeMap.has(key)) continue;

        if (nextI < 0 || cols - 1 < nextI || nextJ < 0 || rows - 1 < nextJ) {
          continue;
        }
        const cell: Cell = map[nextI][nextJ];
        if (
          cell.entity instanceof FixedObstacle ||
          cell.entity instanceof BreakableObstacle ||
          cell.entity instanceof EdgeObstacle ||
          cell.entity instanceof Bomb
        ) {
          continue;
        }

        const nextNode: AStarNode = new AStarNode(cell);
        nextNode.setActualCost(currNode.getActualCost() + 1);
        //影響マップの値
        const valueOfImpactMap: number = this.getCurrImpactMap()[nextI][nextJ];
        if (valueOfImpactMap === Infinity) continue;
        //マンハッタン距離
        const manhattanDistance: number =
          Math.abs(nextI - targetI) + Math.abs(nextJ - targetJ);
        const heuristicCost: number = valueOfImpactMap + manhattanDistance;
        nextNode.setHeuristicCost(heuristicCost);
        nextNode.setPrevNode(currNode);

        searchedNodeMap.set(key, nextNode);
        queue.insert({
          data: nextNode,
          priority: heuristicCost,
        });
      }
    }

    this.setCurrRoute(route);
  }

  //ダイクストラ法で自分が移動できる範囲をO(n)で把握する
  public updateMovableArea(): void {
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    const costMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );

    const playerMap: Map<number, Player> = this.stage.getPlayerMap();
    const npcMap: Map<number, Npc> = this.stage.getNpcMap();

    let foundItems: Item[] = [];
    let foundCharacters: Character[] = [];

    const { i, j }: Index = this.getIndex();
    const startCell: Cell = map[i][j];

    //優先度付きキュー
    //priority:number の値が小さい順
    const queue: PriorityQueue<Cell> = new PriorityQueue<Cell>(
      [{ data: startCell, priority: 0 }],
      (a: HeapNode<Cell>, b: HeapNode<Cell>) => a.priority < b.priority,
    );

    //探索したマスのインデックスを格納しておくためのキャッシュ
    let visitedCache: Index[] = [];

    while (!queue.isEmpty()) {
      const currNode: HeapNode<Cell> = queue.pop();
      const currCell: Cell = currNode.data;
      const currPriority: number = currNode.priority;
      const { i, j }: Index = currCell.index;

      if (costMap[i][j] <= currPriority) {
        continue;
      }
      costMap[i][j] = currPriority;
      //探索したマスのインデックスをキャッシュに追加
      visitedCache.push({ i, j });

      //アイテムを発見
      if (currCell.item instanceof Item) {
        foundItems.push(currCell.item);
      }
      //プレイヤーを発見
      playerMap.forEach((player: Player) => {
        if (player.getIsAlive()) {
          const { i: pI, j: pJ }: Index = player.getIndex();
          if (i === pI && j === pJ) {
            foundCharacters.push(player);
          }
        }
      });
      //Npcを発見
      npcMap.forEach((npc: Npc) => {
        if (npc.getIsAlive()) {
          const { i: nI, j: nJ }: Index = npc.getIndex();
          if (i === nI && j === nJ) {
            foundCharacters.push(npc);
          }
        }
      });

      for (const [offsetI, offsetJ] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nextI: number = i + offsetI;
        const nextJ: number = j + offsetJ;

        if (nextI < 0 || cols - 1 < nextI || nextJ < 0 || rows - 1 < nextJ) {
          continue;
        } else {
          const cell: Cell = map[nextI][nextJ];
          if (
            cell.entity instanceof FixedObstacle ||
            cell.entity instanceof BreakableObstacle ||
            cell.entity instanceof EdgeObstacle ||
            cell.entity instanceof Bomb
          ) {
            continue;
          }

          const priority: number = currPriority + 1;
          queue.insert({ data: cell, priority: priority });
        }
      }
    }

    //Npcが移動できるエリアの情報を更新
    this.setMovableArea(visitedCache);
    //移動できるエリア内にあるアイテムを渡す
    this.setFoundItems(foundItems);
    //移動できるエリア内にいるキャラクターを渡す
    this.setFoundCharacters(foundCharacters);
  }

  private updateImpactMapWithItem(): void {
    this.setImpactMapWithItem(this.createImpactMapWithItem());
  }
  private updateImpactMapWithExplosion(): void {
    this.setImpactMapWithExplosion(this.createImpactMapWithExplosion());
  }
  private updateImpactMapWithObstacle(): void {
    this.setImpactMapWithObstacle(this.createImpactMapWithObstacle());
  }
  private updateImpactMapWithCharacter(): void {
    this.setImpactMapWithCharacter(this.createImpactMapWithCharacter());
  }
  private updateImpactMapForGetItem(): void {
    this.setImpactMapForGetItem(this.createImpactMapForGetItem());
  }
  private updateImpactMapForBreakObstacle(): void {
    this.setImpactMapForBreakObstacle(this.createImpactMapForBreakObstacle());
  }
  private updateImpactMapForAvoidExplosion(): void {
    this.setImpactMapForAvoidExplosion(this.createImpactMapForAvoidExplosion());
  }
  private updateImpactMapForAttackCharacter(): void {
    this.setImpactMapForAttackCharacter(
      this.createImpactMapForAttackCharacter(),
    );
  }

  private createImpactMapWithItem(): number[][] {
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    const impactMapWithItem: number[][] = this.stage.getImpactMapWithItem();
    if (impactMapWithItem && impactMapWithItem.length > 0) {
      this.movableArea.forEach(({ i, j }: Index) => {
        impactMap[i][j] = impactMapWithItem[i][j];
      });
    }
    return impactMap;
  }
  private createImpactMapWithCharacter(): number[][] {
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    this.movableArea.forEach(({ i, j }: Index) => {
      let currValue: number = impactMap[i][j];
      this.foundCharacters.forEach((character: Character) => {
        const impactMapWithMyself = character.getImpactMapWithMyself();
        const value: number = impactMapWithMyself[i][j];
        if (value === Infinity) return;
        else if (currValue === Infinity || currValue < value) {
          currValue = value;
        }
      });
      impactMap[i][j] = currValue;
    });
    return impactMap;
  }
  private createImpactMapWithExplosion(): number[][] {
    const map = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    const impactMapWithExplosion: number[][] =
      this.stage.getImpactMapWithExplosion();
    if (impactMapWithExplosion && impactMapWithExplosion.length > 0) {
      this.movableArea.forEach(({ i, j }: Index) => {
        impactMap[i][j] = impactMapWithExplosion[i][j];
      });
    }
    return impactMap;
  }
  public createImpactMapWithObstacle(): number[][] {
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );

    let max: number = 0;
    this.movableArea.forEach(({ i, j }: Index) => {
      let value: number = 0;
      const directions: [number, number][] = [
        [0, -1], // top
        [1, 0], // right
        [0, 1], // bottom
        [-1, 0], // left
      ];
      directions.forEach(([dx, dy]) => {
        value += this.countBreakableObstacleInDirection(
          i + dx,
          j + dy,
          dx,
          dy,
          map,
        );
      });
      if (value > max) {
        max = value;
      }
      impactMap[i][j] = value;
    });

    //正規化して反転
    this.movableArea.forEach(({ i, j }: Index) => {
      impactMap[i][j] = MathUtil.normalizeAndInvert(impactMap[i][j], max, 0);
    });

    return impactMap;
  }

  private createImpactMapForGetItem(): number[][] {
    const impactMapWithItem: number[][] = this.getImpactMapWithItem();
    const impactMapWithExplosion: number[][] = this.getImpactMapWithExplosion();
    const map = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    this.movableArea.forEach(({ i, j }: Index) => {
      const valueOfItem: number =
        impactMapWithItem[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.GET_ITEM.ITEM;
      const valueOfExplosion: number =
        impactMapWithExplosion[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.GET_ITEM.EXPLOSION;
      impactMap[i][j] = Math.max(valueOfItem, valueOfExplosion);
    });
    return impactMap;
  }

  private createImpactMapForBreakObstacle(): number[][] {
    const impactMapWithObstacle: number[][] = this.getImpactMapWithObstacle();
    const impactMapWithExplosion: number[][] = this.getImpactMapWithExplosion();
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    this.movableArea.forEach(({ i, j }: Index) => {
      const valueOfObstacle: number =
        impactMapWithObstacle[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.BREAK_OBSTACLE.OBSTACLE;
      const valueOfExplosion: number =
        impactMapWithExplosion[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.BREAK_OBSTACLE.EXPLOSION;
      impactMap[i][j] = Math.max(valueOfObstacle, valueOfExplosion);
    });
    return impactMap;
  }
  private createImpactMapForAttackCharacter(): number[][] {
    const impactMapWithCharacter: number[][] = this.getImpactMapWithCharacter();
    const impactMapWithExplosion: number[][] = this.getImpactMapWithExplosion();
    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    let impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    this.movableArea.forEach(({ i, j }: Index) => {
      const valueOfCharacter: number =
        impactMapWithCharacter[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.ATTACK_PLAYER.PLAYER;
      const valueOfExplosion: number =
        impactMapWithExplosion[i][j] *
        Constant.IMPACT_MAP_WEIGHT_COEFFICIENT.ATTACK_PLAYER.EXPLOSION;
      impactMap[i][j] = Math.max(valueOfCharacter, valueOfExplosion);
    });
    return impactMap;
  }
  private createImpactMapForAvoidExplosion(): number[][] {
    return this.getImpactMapWithExplosion();
  }

  private updateAction(): void {
    const forGetItem: { route: Cell[]; target: Item } =
      this.createRouteForGetItem();
    this.setRouteForGetItem(forGetItem.route);
    const forAttackCharacter: { route: Cell[]; target: Character } =
      this.createRouteForAttackCharacter();
    this.setRouteForAttackCharacter(forAttackCharacter.route);
    const forBreakObstacle: { route: Cell[]; target: Cell } =
      this.createRouteForBreakObstacle();
    this.setRouteForBreakObstacle(forBreakObstacle.route);

    const maxLength: number = Math.max(
      forGetItem.route.length,
      forAttackCharacter.route.length,
      forBreakObstacle.route.length,
    );
    if (maxLength <= 0) {
      this.resetAction();
      this.resetTarget();
      this.setCurrRoute([]);
      return;
    }

    //「経路が短い = 移動コストが小さい」ものをターゲットに設定する
    if (
      forGetItem.route.length > 0 &&
      (forGetItem.route.length <= forAttackCharacter.route.length ||
        forAttackCharacter.route.length <= 0) &&
      (forGetItem.route.length <= forBreakObstacle.route.length ||
        forBreakObstacle.route.length <= 0)
    ) {
      // routeForGetItem.route が最も短い場合の処理
      this.setAction('GET_ITEM');
      this.setTargetForGetItem({ item: forGetItem.target });
    } else if (
      forAttackCharacter.route.length > 0 &&
      (forAttackCharacter.route.length <= forGetItem.route.length ||
        forGetItem.route.length <= 0) &&
      (forAttackCharacter.route.length <= forBreakObstacle.route.length ||
        forBreakObstacle.route.length <= 0)
    ) {
      // routeForAttackCharacter.route が最も短い場合の処理
      this.setAction('ATTACK_CHARACTER');
      this.setTargetForAttackCharacter({
        character: forAttackCharacter.target,
      });
    } else if (
      forBreakObstacle.route.length > 0 &&
      (forBreakObstacle.route.length <= forGetItem.route.length ||
        forGetItem.route.length <= 0) &&
      (forBreakObstacle.route.length <= forAttackCharacter.route.length ||
        forAttackCharacter.route.length <= 0)
    ) {
      // routeForBreakObstacle.route が最も短い場合の処理
      this.setAction('BREAK_OBSTACLE');
      this.setTargetForBreakObstacle({ cell: forBreakObstacle.target });
    }
  }

  private countBreakableObstacleInDirection(
    i: number,
    j: number,
    di: number,
    dj: number,
    map: Cell[][],
  ): number {
    let count: number = 0;
    for (
      let k: number = 0;
      k < this.getExplosionRange() &&
      0 < i &&
      i < this.stage.getCols() - 1 &&
      0 < j &&
      j < this.stage.getRows() - 1;
      k++, i += di, j += dj
    ) {
      const cell: Cell = map[i][j];
      if (cell.entity instanceof FixedObstacle) break;
      else if (cell.entity instanceof BreakableObstacle) {
        count++;
        break;
      }
    }
    return count;
  }

  private createRoute(
    impactMap: number[][],
    targetI: number,
    targetJ: number,
    action:
      | ''
      | 'GET_ITEM'
      | 'ATTACK_CHARACTER'
      | 'BREAK_OBSTACLE'
      | 'AVOID_EXPLOSION',
  ): Cell[] {
    //A*アルゴリズムで最適な経路を求める
    //経路
    let route: Cell[] = [];
    if (!impactMap || impactMap.length <= 0) return route;

    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;

    if (
      !(0 < targetI && targetI < cols - 1 && 0 < targetJ && targetJ < rows - 1)
    )
      return route;

    const { i, j }: Index = this.getIndex();
    const startCell: Cell = map[i][j];
    const startNode: AStarNode = new AStarNode(startCell);
    startNode.setActualCost(0);

    //影響マップの値
    const valueOfImpactMap: number = impactMap[i][j];

    //マンハッタン距離
    const manhattanDistance: number =
      Math.abs(i - targetI) + Math.abs(j - targetJ);
    const manhattanCost: number =
      manhattanDistance / (this.movableArea.length * (this.getSpeed() / 10));
    startNode.setHeuristicCost(valueOfImpactMap + manhattanCost);

    //探索済みのノードを格納するMap
    //keyは(id = i + map.length * j)
    let searchedNodeMap: Map<number, AStarNode> = new Map<number, AStarNode>();
    //スタートノードを追加
    const key: number = i + map.length * j;
    searchedNodeMap.set(key, startNode);

    const comparator: (
      a: HeapNode<AStarNode>,
      b: HeapNode<AStarNode>,
    ) => boolean = (a: HeapNode<AStarNode>, b: HeapNode<AStarNode>) => {
      return (
        a.data.getActualCost() + a.data.getHeuristicCost() <
        b.data.getActualCost() + b.data.getHeuristicCost()
      );
    };

    //優先度付きキュー
    const queue: PriorityQueue<AStarNode> = new PriorityQueue<AStarNode>(
      [{ data: startNode, priority: valueOfImpactMap }],
      comparator,
    );

    while (!queue.isEmpty()) {
      const currHeapNode: HeapNode<AStarNode> = queue.pop();
      const currNode: AStarNode = currHeapNode.data;
      const currCell: Cell = currNode.getCell();
      const { i, j }: Index = currCell.index;

      const priority: number = currHeapNode.priority;
      //優先度(影響マップの値)が１以上（= 爆風が想定されるマス）
      if (action === 'AVOID_EXPLOSION') {
        if (currCell instanceof Bomb) continue;
      } else if (priority >= 1) {
        continue;
      }

      //目標のマスに到達した時
      if (i === targetI && j === targetJ) {
        let node: AStarNode = currNode;
        while (node.getPrevNode() !== null) {
          route.push(node.getCell());
          node = node.getPrevNode();
        }

        break;
      }

      for (const [offsetI, offsetJ] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nextI: number = i + offsetI;
        const nextJ: number = j + offsetJ;
        const key: number = nextI + map.length * nextJ;
        if (searchedNodeMap.has(key)) continue;

        if (nextI < 0 || cols - 1 < nextI || nextJ < 0 || rows - 1 < nextJ) {
          continue;
        }
        const cell: Cell = map[nextI][nextJ];
        if (
          cell.entity instanceof FixedObstacle ||
          cell.entity instanceof BreakableObstacle ||
          cell.entity instanceof EdgeObstacle ||
          cell.entity instanceof Bomb
        ) {
          continue;
        }

        const nextNode: AStarNode = new AStarNode(cell);
        nextNode.setActualCost(
          currNode.getActualCost() +
            1 / (this.movableArea.length * (this.getSpeed() / 10)),
        );
        //影響マップの値
        const valueOfImpactMap: number = impactMap[nextI][nextJ];
        if (valueOfImpactMap === Infinity) continue;
        //マンハッタン距離
        const manhattanDistance: number =
          Math.abs(nextI - targetI) + Math.abs(nextJ - targetJ);
        const manhattanCost: number =
          manhattanDistance /
          (this.movableArea.length * (this.getSpeed() / 10));
        const heuristicCost: number = valueOfImpactMap + manhattanCost;
        nextNode.setHeuristicCost(heuristicCost);
        nextNode.setPrevNode(currNode);

        searchedNodeMap.set(key, nextNode);
        queue.insert({
          data: nextNode,
          priority: valueOfImpactMap,
        });
      }
    }
    return route;
  }
  //障害物の破壊のため、Bombを設置するのに適したマスを探すメソッド
  private searchCellForBreakObstacle(impactMap: number[][]): Cell[] {
    const map: Cell[][] = this.stage.getMap();

    const { i, j }: Index = this.getIndex();

    //優先度付きキュー
    //priority:number の値が小さい順
    const queue: PriorityQueue<Cell> = new PriorityQueue<Cell>(
      [],
      (a: HeapNode<Cell>, b: HeapNode<Cell>) => a.priority < b.priority,
    );

    this.movableArea.forEach(({ i: currI, j: currJ }: Index) => {
      //マンハッタン距離
      const manhattanDistance: number =
        Math.abs(currI - i) + Math.abs(currJ - j);
      const manhattanCost: number =
        manhattanDistance / (this.movableArea.length * (this.getSpeed() / 10));

      const valueOfImpactMap: number = impactMap[currI][currJ];
      const heuristicCost: number = valueOfImpactMap + manhattanCost;

      queue.insert({ data: map[currI][currJ], priority: heuristicCost });
    });

    let res: Cell[] = [];
    while (!queue.isEmpty()) {
      res.push(queue.pop().data);
    }
    return res;
  }
  private searchCellsForAvoidExplosion(
    impactMapForAvoidExplosion: number[][],
  ): Cell[] {
    let foundCells: Cell[] = [];

    const map: Cell[][] = this.stage.getMap();
    const cols: number = map.length;
    const rows: number = map[0].length;
    const costMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );

    const { i, j }: Index = this.getIndex();
    const startCell: Cell = map[i][j];

    //優先度付きキュー
    //priority:number の値が小さい順
    const queue: PriorityQueue<Cell> = new PriorityQueue<Cell>(
      [{ data: startCell, priority: 0 }],
      (a: HeapNode<Cell>, b: HeapNode<Cell>) => a.priority < b.priority,
    );

    //探索したマスのインデックスを格納しておくためのキャッシュ
    let visitedCache: Index[] = [];

    while (!queue.isEmpty()) {
      const currNode: HeapNode<Cell> = queue.pop();
      const currCell: Cell = currNode.data;
      const currPriority: number = currNode.priority;
      const { i, j }: Index = currCell.index;

      if (costMap[i][j] <= currPriority) {
        continue;
      }
      costMap[i][j] = currPriority;
      //探索したマスのインデックスをキャッシュに追加
      visitedCache.push({ i, j });

      if (impactMapForAvoidExplosion[i][j] === 0) {
        foundCells.push(currCell);
      }

      for (const [offsetI, offsetJ] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nextI: number = i + offsetI;
        const nextJ: number = j + offsetJ;

        if (nextI < 0 || cols - 1 < nextI || nextJ < 0 || rows - 1 < nextJ) {
          continue;
        } else {
          const cell: Cell = map[nextI][nextJ];
          if (
            cell.entity instanceof FixedObstacle ||
            cell.entity instanceof BreakableObstacle ||
            cell.entity instanceof EdgeObstacle ||
            cell.entity instanceof Bomb
          ) {
            continue;
          }

          const priority: number = currPriority + 1;
          queue.insert({ data: cell, priority: priority });
        }
      }
    }
    return foundCells;
  }

  private createRouteForGetItem(): { route: Cell[]; target: Item } {
    if (!this.foundItems || this.foundItems.length <= 0)
      return { route: [], target: null };

    let res: { route: Cell[]; target: Item } = { route: [], target: null };
    for (let i = 0; i < this.foundItems.length; i++) {
      const target: Item = this.foundItems[i];
      if (!target) continue;

      const { i: targetI, j: targetJ }: Index = target.getIndex();
      const currRoute: Cell[] = this.createRoute(
        this.getImpactMapForGetItem(),
        targetI,
        targetJ,
        'GET_ITEM',
      );
      if (currRoute.length > 0) {
        res = {
          route: currRoute,
          target: target,
        };
        break;
      }
    }
    return res;
  }
  private createRouteForAttackCharacter(): {
    route: Cell[];
    target: Character;
  } {
    if (!this.foundCharacters || this.foundCharacters.length <= 0)
      return { route: [], target: null };

    let res: {
      route: Cell[];
      target: Character;
    } = { route: [], target: null };
    for (let i = 0; i < this.foundCharacters.length; i++) {
      const target: Character = this.foundCharacters[i];
      if (!target) continue;

      const { i: targetI, j: targetJ }: Index = target.getIndex();
      const currRoute: Cell[] = this.createRoute(
        this.getImpactMapForAttackCharacter(),
        targetI,
        targetJ,
        'ATTACK_CHARACTER',
      );
      if (currRoute.length > 0) {
        res = {
          route: currRoute,
          target: target,
        };
        break;
      }
    }
    return res;
  }
  private createRouteForBreakObstacle(): { route: Cell[]; target: Cell } {
    if (this.stage.getBreakableObstacleManager().getMap().size <= 0)
      return { route: [], target: null };
    const impactMap: number[][] = this.getImpactMapForBreakObstacle();
    const targetCells: Cell[] = this.searchCellForBreakObstacle(impactMap);
    if (!targetCells || targetCells.length <= 0)
      return { route: [], target: null };

    let res: { route: Cell[]; target: Cell } = { route: [], target: null };
    for (let k = 0; k < targetCells.length; k++) {
      const targetCell: Cell = targetCells[k];
      const { i, j }: Index = targetCell.index;
      const route = this.createRoute(impactMap, i, j, 'BREAK_OBSTACLE');
      if (route.length > 0) {
        res = {
          route: route,
          target: targetCell,
        };
        break;
      }
    }
    return res;
  }
  private createRouteForAvoidExplosion(
    impactMapForAvoidExplosion: number[][],
  ): { route: Cell[]; target: Cell } {
    const cells: Cell[] = this.searchCellsForAvoidExplosion(
      impactMapForAvoidExplosion,
    );
    if (!cells || cells.length <= 0) return { route: [], target: null };
    const impactMap: number[][] = impactMapForAvoidExplosion;

    let res: { route: Cell[]; target: Cell } = { route: [], target: null };
    for (let k = 0; k < cells.length; k++) {
      const targetCell: Cell = cells[k];
      const { i, j }: Index = targetCell.index;
      const route: Cell[] = this.createRoute(
        impactMap,
        i,
        j,
        'AVOID_EXPLOSION',
      );
      if (route.length > 0) {
        res = {
          route: route,
          target: targetCell,
        };
        break;
      }
    }
    return res;
  }

  private targetExists(): boolean {
    const target: {
      forGetItem: {
        item: Item;
      };
      forAttackCharacter: {
        character: Character;
      };
      forBreakObstacle: {
        cell: Cell;
      };
      forAvoidExplosion: {
        cell: Cell;
      };
    } = this.target;
    return (
      target.forGetItem.item !== null ||
      target.forAttackCharacter.character !== null ||
      target.forBreakObstacle.cell !== null ||
      target.forAvoidExplosion.cell !== null
    );
  }
  private actionExists(): boolean {
    return (
      this.action === 'GET_ITEM' ||
      this.action === 'ATTACK_CHARACTER' ||
      this.action === 'BREAK_OBSTACLE' ||
      this.action === 'AVOID_EXPLOSION'
    );
  }
  private resetTarget(): void {
    this.target = {
      forGetItem: { item: null },
      forAttackCharacter: { character: null },
      forBreakObstacle: { cell: null },
      forAvoidExplosion: { cell: null },
    };
  }
  private resetAction(): void {
    this.action = '';
  }
  private isExplosionExpected(): boolean {
    const { i, j }: Index = this.getIndex();
    const impactMapForAvoidExplosion: number[][] =
      this.getImpactMapForAvoidExplosion();
    return impactMapForAvoidExplosion[i][j] === 1;
  }
  private hasReachedTargetCell(): boolean {
    const { i, j }: Index = this.getIndex();
    const map: Cell[][] = this.stage.getMap();
    let targetCell: Cell = null;
    switch (this.action) {
      case 'GET_ITEM':
        const targetForGetItem: { item: Item } = this.getTargetForGetItem();
        const item: Item = targetForGetItem.item;
        const { i: itemI, j: itemJ }: Index = item.getIndex();

        targetCell = map[itemI][itemJ];
        break;
      case 'ATTACK_CHARACTER':
        const targetForAttackCharacter: {
          character: Character;
        } = this.getTargetForAttackCharacter();
        const { i: characterI, j: characterJ }: Index =
          targetForAttackCharacter.character.getIndex();
        targetCell = map[characterI][characterJ];
        break;
      case 'BREAK_OBSTACLE':
        const targetForBreakObstacle: { cell: Cell } =
          this.getTargetForBreakObstacle();
        targetCell = targetForBreakObstacle.cell;
        break;
      case 'AVOID_EXPLOSION':
        const targetForAvoidExplosion: { cell: Cell } =
          this.getTargetForAvoidExplosion();
        targetCell = targetForAvoidExplosion.cell;
    }
    if (!targetCell) return false;
    const { i: targetI, j: targetJ }: Index = targetCell.index;

    if (this.action === 'ATTACK_CHARACTER') {
      const manhattanDistance = Math.abs(i - targetI) + Math.abs(j - targetJ);
      return manhattanDistance <= this.getExplosionRange();
    } else return i === targetI && j === targetJ;
  }

  private createIndexesOfExplosionByPuttingBombInDirection(
    i: number,
    j: number,
    di: number,
    dj: number,
    map: Cell[][],
  ): Index[] {
    let arr: Index[] = [];
    for (
      let k: number = 0;
      k < this.getExplosionRange() &&
      0 < i &&
      i < this.stage.getCols() - 1 &&
      0 < j &&
      j < this.stage.getRows() - 1;
      k++, i += di, j += dj
    ) {
      const cell: Cell = map[i][j];
      if (cell.entity instanceof FixedObstacle) break;
      else if (cell.entity instanceof BreakableObstacle) {
        arr.push(cell.index);
        break;
      } else arr.push(cell.index);
    }
    return arr;
  }
  private createIndexesOfExplosionExpectedByPuttingBomb(): Index[] {
    let arr: Index[] = [];
    const map: Cell[][] = this.stage.getMap();
    const { i: centerI, j: centerJ }: Index = this.getIndex();

    arr.push({ i: centerI, j: centerJ });

    //上
    arr.concat(
      this.createIndexesOfExplosionByPuttingBombInDirection(
        centerI,
        centerJ - 1,
        0,
        -1,
        map,
      ),
    );
    //右
    arr.concat(
      this.createIndexesOfExplosionByPuttingBombInDirection(
        centerI + 1,
        centerJ,
        1,
        0,
        map,
      ),
    );
    //下
    arr.concat(
      this.createIndexesOfExplosionByPuttingBombInDirection(
        centerI,
        centerJ + 1,
        0,
        1,
        map,
      ),
    );
    //左
    arr.concat(
      this.createIndexesOfExplosionByPuttingBombInDirection(
        centerI - 1,
        centerJ,
        -1,
        0,
        map,
      ),
    );

    return arr;
  }
  //Bombを置いた後に逃げ場があるかどうかを判定するメソッド
  private canAvoidExplosionAfterPutBomb(): boolean {
    const impactMapForAvoidExplosion: number[][] = [
      ...this.getImpactMapForAvoidExplosion(),
    ];
    const indexesOfExplosionExpectedByPuttingBomb: Index[] =
      this.createIndexesOfExplosionExpectedByPuttingBomb();
    indexesOfExplosionExpectedByPuttingBomb.forEach(({ i, j }: Index) => {
      impactMapForAvoidExplosion[i][j] = 1;
    });
    return this.movableArea.some(
      ({ i, j }: Index) => impactMapForAvoidExplosion[i][j] === 0,
    );
  }
}
