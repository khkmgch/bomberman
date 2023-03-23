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
import { BreakableObstacleManager } from '../../managers/BreakableObstacleManager';
import { EdgeObstacleManager } from '../../managers/EdgeObstacleManager';
import { FixedObstacleManager } from '../../managers/FixedObstacleManager';
import { GroundManager } from '../../managers/GroundManager';
import { GameObject } from '../../objects/GameObject';
import { Npc } from '../../objects/Npc';
import { Player } from '../../objects/Player';

// ステージの汎用クラス
export class GenericStage implements IStage {
  protected tileSize: number;
  protected rows: number;
  protected cols: number;
  protected map: GameObject[][];
  protected groundManager: GroundManager = new GroundManager();
  protected edgeObstacleManager: EdgeObstacleManager =
    new EdgeObstacleManager();
  protected fixedObstacleManager: FixedObstacleManager =
    new FixedObstacleManager();
  protected breakableObstacleManager: BreakableObstacleManager =
    new BreakableObstacleManager();
  protected playerMap: Map<number, Player> = new Map<number, Player>();
  protected npcMap: Map<number, Npc> = new Map<number, Npc>();

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
  public getMap(): GameObject[][] {
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
      arr.push(player.toDTO());
    });
    this.npcMap.forEach((npc) => {
      arr.push(npc.toDTO());
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
  protected setMap(map: GameObject[][]): void {
    this.map = map;
  }

  /* others - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public update(deltaTime: number): void {
    this.updatePlayers(deltaTime);
  }

  public updatePlayers(deltaTime: number): void {
    this.playerMap.forEach((player: Player) => {
      player.update(deltaTime, this);
    });
  }

  public createBomb(id: number): void {}

  public movePlayer(id: number, movement: Movement): void {
    this.playerMap.get(id).setMovement(movement);
  }

  public playerExists(id: number) {
    return (
      0 <= id && id <= Constant.MAX_PLAYERS_PER_ROOM && this.playerMap.has(id)
    );
  }
}
