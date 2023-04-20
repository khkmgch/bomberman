import Constant from 'src/constant';
import { EventsGateway } from 'src/events/events.gateway';
import { BreakableObstacleDTO } from 'src/game/dtos/BreakableObstacleDTO';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';
import { EdgeObstacleDTO } from 'src/game/dtos/EdgeObstacleDTO';
import { FixedObstacleDTO } from 'src/game/dtos/FixedObstacleDTO';
import { GroundDTO } from 'src/game/dtos/GroundDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Movement } from 'src/game/types/Movement';
import { Position } from 'src/game/types/Position';
import { BombManager } from '../../managers/BombManager';
import { BreakableObstacleManager } from '../../managers/BreakableObstacleManager';
import { EdgeObstacleManager } from '../../managers/EdgeObstacleManager';
import { ExplosionManager } from '../../managers/ExplosionManager';
import { FixedObstacleManager } from '../../managers/FixedObstacleManager';
import { GroundManager } from '../../managers/GroundManager';
import { MarkerManager } from '../../managers/MarkerManager';
import { Npc } from '../../objects/character/Npc';
import { Player } from '../../objects/character/Player';
import { ItemManager } from '../../managers/ItemManager';
import { Cell } from 'src/game/types/Cell';
import { Item } from '../../objects/item/Item';
import { NpcUtil } from 'src/game/utils/NpcUtil';
import { Index } from 'src/game/types/Index';
import { Marker } from '../../objects/attack/Marker';
import { Bomb } from '../../objects/attack/Bomb';
import { BreakableObstacle } from '../../objects/map/obstacle/BreakableObstacle';
import { Explosion } from '../../objects/attack/Explosion';
import { Character } from '../../objects/character/Character';
import { RankingManager } from '../../managers/rankingManager';

// ステージの汎用クラス
export class GenericStage implements IStage {
  protected tileSize: number;
  protected rows: number;
  protected cols: number;
  protected map: Cell[][];
  protected groundManager: GroundManager = new GroundManager();
  protected edgeObstacleManager: EdgeObstacleManager =
    new EdgeObstacleManager();
  protected fixedObstacleManager: FixedObstacleManager =
    new FixedObstacleManager();
  protected breakableObstacleManager: BreakableObstacleManager =
    new BreakableObstacleManager();
  protected playerMap: Map<number, Player> = new Map<number, Player>();
  protected npcMap: Map<number, Npc> = new Map<number, Npc>();
  protected bombManager: BombManager = new BombManager();
  protected markerManager: MarkerManager = new MarkerManager();
  protected explosionManager: ExplosionManager = new ExplosionManager();
  protected itemManager: ItemManager = new ItemManager();

  protected impactMaps: { item: number[][]; explosion: number[][] } = {
    item: [],
    explosion: [],
  };
  protected rankingManager: RankingManager = new RankingManager();

  constructor(
    protected type: string,
    protected level: number,
    protected eventsGateway: EventsGateway,
    protected roomId: string,
  ) {}

  /* getter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public getType(): string {
    return `Stage type: ${this.type}`;
  }

  public getEventGateway(): EventsGateway {
    return this.eventsGateway;
  }
  public getRoomId(): string {
    return this.roomId;
  }
  public getTileSize(): number {
    return this.tileSize;
  }
  public getRows(): number {
    return this.rows;
  }
  public getCols(): number {
    return this.cols;
  }
  public getMap(): Cell[][] {
    return this.map;
  }

  public getGroundManager(): GroundManager {
    return this.groundManager;
  }
  public getEdgeObstacleManager(): EdgeObstacleManager {
    return this.edgeObstacleManager;
  }
  public getFixedObstacleManager(): FixedObstacleManager {
    return this.fixedObstacleManager;
  }
  public getBreakableObstacleManager(): BreakableObstacleManager {
    return this.breakableObstacleManager;
  }
  public getPlayerMap(): Map<number, Player> {
    return this.playerMap;
  }
  public getNpcMap(): Map<number, Npc> {
    return this.npcMap;
  }
  public getBombManager(): BombManager {
    return this.bombManager;
  }
  public getMarkerManager(): MarkerManager {
    return this.markerManager;
  }
  public getExplosionManager(): ExplosionManager {
    return this.explosionManager;
  }
  public getItemManager(): ItemManager {
    return this.itemManager;
  }

  public getInitialState(): {
    groundArr: GroundDTO[];
    edgeObstacleArr: EdgeObstacleDTO[];
    fixedObstacleArr: FixedObstacleDTO[];
    breakableObstacleArr: BreakableObstacleDTO[];
    characterArr: CharacterDTO[];
  } {
    return {
      groundArr: this.getGroundDTOs(),
      edgeObstacleArr: this.getEdgeObstacleDTOs(),
      fixedObstacleArr: this.getFixedObstacleDTOs(),
      breakableObstacleArr: this.getBreakableObstacleDTOs(),
      characterArr: this.getCharacterDTOs(),
    };
  }
  public getSyncState(): {
    characterArr: CharacterDTO[];
  } {
    return {
      characterArr: this.getCharacterDTOs(),
    };
  }

  private getCharacterDTOs(): CharacterDTO[] {
    let arr: CharacterDTO[] = [];
    this.playerMap.forEach((player) => {
      if (player.getIsAlive()) arr.push(player.toDTO());
    });
    this.npcMap.forEach((npc) => {
      if (npc.getIsAlive()) arr.push(npc.toDTO());
    });
    return arr;
  }

  private getGroundDTOs(): GroundDTO[] {
    let arr: GroundDTO[] = [];
    this.groundManager.getMap().forEach((ground) => {
      arr.push(ground.toDTO());
    });
    return arr;
  }
  private getEdgeObstacleDTOs(): EdgeObstacleDTO[] {
    let arr: EdgeObstacleDTO[] = [];
    this.edgeObstacleManager.getMap().forEach((edgeObstacle) => {
      arr.push(edgeObstacle.toDTO());
    });
    return arr;
  }
  private getFixedObstacleDTOs() {
    let arr: FixedObstacleDTO[] = [];
    this.fixedObstacleManager.getMap().forEach((fixedObstacle) => {
      arr.push(fixedObstacle.toDTO());
    });
    return arr;
  }
  private getBreakableObstacleDTOs() {
    let arr: BreakableObstacleDTO[] = [];
    this.breakableObstacleManager.getMap().forEach((breakableObstacle) => {
      arr.push(breakableObstacle.toDTO());
    });
    return arr;
  }

  protected getCharacterInitialPosition(id: number): Position {
    let i: number;
    let j: number;
    switch (id) {
      case 0:
        i = 1;
        j = 1;
        break;
      case 1:
        i = this.cols - 2;
        j = 1;
        break;
      case 2:
        i = this.cols - 2;
        j = this.rows - 2;
        break;
      case 3:
        i = 1;
        j = this.rows - 2;
        break;
    }
    return { x: i * this.tileSize, y: j * this.tileSize };
  }

  public getImpactMapWithItem(): number[][] {
    return this.impactMaps.item;
  }
  public getImpactMapWithExplosion(): number[][] {
    return this.impactMaps.explosion;
  }
  public getRankingManager(): RankingManager {
    return this.rankingManager;
  }

  /* setter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  protected setTileSize(tileSize: number): void {
    this.tileSize = tileSize;
  }
  protected setRows(rows: number): void {
    this.rows = rows;
  }
  protected setCols(cols: number): void {
    this.cols = cols;
  }
  protected setMap(map: Cell[][]): void {
    this.map = map;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public update(deltaTime: number): void {
    this.updatePlayers(deltaTime);
    this.updateNpcs(deltaTime);
  }

  public updatePlayers(deltaTime: number): void {
    this.playerMap.forEach((player: Player) => {
      if (player.getIsAlive()) {
        player.update(deltaTime);
      }
    });
  }
  private updateNpcs(deltaTime: number): void {
    this.npcMap.forEach((npc: Npc) => {
      if (npc.getIsAlive()) {
        npc.update(deltaTime);
      }
    });
  }

  public playerPutBomb(playerId: number): void {
    this.playerMap.get(playerId).putBomb();
  }

  public movePlayer(id: number, movement: Movement): void {
    this.playerMap.get(id).setMovement(movement);
  }

  public playerExists(id: number) {
    return (
      0 <= id && id <= Constant.MAX_PLAYERS_PER_ROOM && this.playerMap.has(id)
    );
  }
  public isGameOver(): boolean {
    if (this.rankingManager.getMap().size >= Constant.MAX_PLAYERS_PER_ROOM - 1)
      return true;
    else {
      let res: boolean = true;
      this.playerMap.forEach((player: Player) => {
        if (player.getIsAlive()) res = false;
      });
      return res;
    }
  }
  public rankCharacters(): void {
    if (this.rankingManager.getMap().size >= Constant.MAX_PLAYERS_PER_ROOM)
      return;
    else {
      let arr: Character[] = [];
      this.playerMap.forEach((player: Player) => {
        if (player.getIsAlive()) arr.push(player);
      });
      this.npcMap.forEach((npc: Npc) => {
        if (npc.getIsAlive()) arr.push(npc);
      });
      arr.sort((a: Character, b: Character) => a.getStock() - b.getStock());

      arr.forEach((character: Character) => {
        this.rankingManager
          .getMap()
          .set(this.rankingManager.getCurrId(), character);
        this.rankingManager.decrementCurrId();
      });
    }
  }

  protected initImpactMaps(): void {
    this.impactMaps = {
      item: this.createImpactMap(),
      explosion: this.createImpactMap(),
    };
  }
  private createImpactMap(): number[][] {
    let impactMap: number[][] = Array.from({ length: this.cols }, () =>
      Array.from({ length: this.rows }, () => Infinity),
    );
    this.map.forEach((cellArr: Cell[]) => {
      cellArr.forEach((cell: Cell) => {
        if (cell.entity === null) {
          const { i, j }: Index = cell.index;
          impactMap[i][j] = 0;
        }
      });
    });
    return impactMap;
  }

  public updateImpactMapWithItem(): void {
    const itemMap: Map<number, Item> = this.itemManager.getMap();
    const impactMaps: Map<number, number[][]> = new Map<number, number[][]>();
    itemMap.forEach((item: Item, key: number) => {
      const { i, j }: Index = item.getIndex();
      const cell: Cell = this.map[i][j];
      impactMaps.set(key, NpcUtil.createImpactMap(cell, this.map));
    });
    const impactMap: number[][] = Array.from({ length: this.cols }, () =>
      Array.from({ length: this.rows }, () => Infinity),
    );
    for (let i = 0; i < impactMap.length; i++) {
      for (let j = 0; j < impactMap[i].length; j++) {
        let currValue: number = impactMap[i][j];
        impactMaps.forEach((currMap: number[][]) => {
          const value: number = currMap[i][j];
          if (value === Infinity) return;
          else if (currValue === Infinity || value < currValue) {
            currValue = value;
          }
        });
        impactMap[i][j] = currValue;
      }
    }

    this.impactMaps.item = impactMap;
    // console.log('impactMapByItem', this.impactMap.item);
  }
  public updateImpactMapWithExplosion(): void {
    const bombMap = this.bombManager.getMap();
    const markerMap: Map<number, Marker> = this.markerManager.getMap();
    const explosionMap: Map<number, Explosion> = this.explosionManager.getMap();
    const impactMap: number[][] = Array.from({ length: this.cols }, () =>
      Array.from({ length: this.rows }, () => Infinity),
    );

    for (let i = 1; i < this.map.length - 1; i++) {
      for (let j = 1; j < this.map[i].length - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) continue;
        const cell: Cell = this.map[i][j];
        if (cell.entity instanceof BreakableObstacle) {
          continue;
        }
        const { i: currI, j: currJ }: Index = cell.index;
        impactMap[currI][currJ] = 0;
      }
    }
    bombMap.forEach((bomb: Bomb) => {
      const { i, j }: Index = bomb.getIndex();
      impactMap[i][j] = 1;
    });
    markerMap.forEach((marker: Marker) => {
      const { i, j }: Index = marker.getIndex();
      impactMap[i][j] = 1;
    });
    explosionMap.forEach((explosion: Explosion) => {
      const { i, j }: Index = explosion.getIndex();
      impactMap[i][j] = 1;
    });
    this.impactMaps.explosion = impactMap;
    // console.log('this.impactMap.explosion : ', this.impactMap.explosion);
  }
}
