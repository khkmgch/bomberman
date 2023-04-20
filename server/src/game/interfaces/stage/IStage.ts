import { EventsGateway } from 'src/events/events.gateway';
import { GroundDTO } from 'src/game/dtos/GroundDTO';
import { BreakableObstacleManager } from 'src/game/models/managers/BreakableObstacleManager';
import { EdgeObstacleManager } from 'src/game/models/managers/EdgeObstacleManager';
import { FixedObstacleManager } from 'src/game/models/managers/FixedObstacleManager';
import { GroundManager } from 'src/game/models/managers/GroundManager';
import { GameObject } from 'src/game/models/objects/GameObject';
import { Npc } from 'src/game/models/objects/character/Npc';
import { Player } from 'src/game/models/objects/character/Player';
import { Movement } from 'src/game/types/Movement';
import { EdgeObstacleDTO } from 'src/game/dtos/EdgeObstacleDTO';
import { FixedObstacleDTO } from 'src/game/dtos/FixedObstacleDTO';
import { BreakableObstacleDTO } from 'src/game/dtos/BreakableObstacleDTO';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';
import { BombManager } from 'src/game/models/managers/BombManager';
import { MarkerManager } from 'src/game/models/managers/MarkerManager';
import { ExplosionManager } from 'src/game/models/managers/ExplosionManager';
import { ItemManager } from 'src/game/models/managers/ItemManager';
import { Cell } from 'src/game/types/Cell';
import { Character } from 'src/game/models/objects/character/Character';
import { RankingManager } from 'src/game/models/managers/rankingManager';

// ステージインターフェース
export interface IStage {
  getType(): string;

  getEventGateway(): EventsGateway;
  getRoomId(): string;
  getTileSize(): number;
  getRows(): number;
  getCols(): number;
  getMap(): Cell[][];

  getGroundManager(): GroundManager;
  getEdgeObstacleManager(): EdgeObstacleManager;
  getFixedObstacleManager(): FixedObstacleManager;
  getBreakableObstacleManager(): BreakableObstacleManager;
  getPlayerMap(): Map<number, Player>;
  getNpcMap(): Map<number, Npc>;
  getBombManager(): BombManager;
  getMarkerManager(): MarkerManager;
  getExplosionManager(): ExplosionManager;
  getItemManager(): ItemManager;

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

  getImpactMapWithItem(): number[][];

  getImpactMapWithExplosion(): number[][];

  getRankingManager(): RankingManager;

  update(deltaTime: number): void;

  playerPutBomb(playerId: number): void;

  movePlayer(id: number, movement: Movement): void;

  playerExists(id: number): boolean;

  updateImpactMapWithItem(): void;

  updateImpactMapWithExplosion(): void;

  isGameOver(): boolean;

  rankCharacters(): void;
}
