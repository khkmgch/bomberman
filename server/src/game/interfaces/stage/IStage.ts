import { EventsGateway } from 'src/events/events.gateway';
import { GroundDTO } from 'src/game/dtos/GroundDTO';
import { BreakableObstacleManager } from 'src/game/models/managers/BreakableObstacleManager';
import { EdgeObstacleManager } from 'src/game/models/managers/EdgeObstacleManager';
import { FixedObstacleManager } from 'src/game/models/managers/FixedObstacleManager';
import { GroundManager } from 'src/game/models/managers/GroundManager';
import { GameObject } from 'src/game/models/objects/GameObject';
import { Npc } from 'src/game/models/objects/Npc';
import { Player } from 'src/game/models/objects/Player';
import { Movement } from 'src/game/types/Movement';
import { EdgeObstacleDTO } from 'src/game/dtos/EdgeObstacleDTO';
import { FixedObstacleDTO } from 'src/game/dtos/FixedObstacleDTO';
import { BreakableObstacleDTO } from 'src/game/dtos/BreakableObstacleDTO';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';

// ステージインターフェース
export interface IStage {
  getType(): string;

  getEventGateway(): EventsGateway;
  getRoomId(): string;
  getTileSize(): number;
  getRows(): number;
  getCols(): number;
  getMap(): GameObject[][];

  getGroundManager(): GroundManager;
  getEdgeObstacleManager(): EdgeObstacleManager;
  getFixedObstacleManager(): FixedObstacleManager;
  getBreakableObstacleManager(): BreakableObstacleManager;
  getPlayerMap(): Map<number, Player>;
  getNpcMap(): Map<number, Npc>;

  getInitialState(): {
    groundArr: GroundDTO[];
    edgeObstacleArr: EdgeObstacleDTO[];
    fixedObstacleArr: FixedObstacleDTO[];
    breakableObstacleArr: BreakableObstacleDTO[];
    characterArr: CharacterDTO[];
  };
  getSyncState(): {
    characterArr: CharacterDTO[];
  };

  update(deltaTime: number): void;

  createBomb(id: number): void;

  movePlayer(id: number, movement: Movement): void;

  playerExists(id: number): boolean;
}
