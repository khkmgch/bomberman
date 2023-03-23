import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';

export type Objects = {
  characterMap: Map<number, ICharacter>;
  groundMap: Map<number, IGround>;
  breakableObstacleMap: Map<number, IBreakableObstacle>;
  fixedObstacleMap: Map<number, IFixedObstacle>;
  edgeObstacleMap: Map<number, IEdgeObstacle>;
  bombMap: {
    [id: number]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: BombDto | null;
    };
  };
  explosionMap: {
    [id: number]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: ExplosionDto | null;
    };
  };
  itemMap: {
    [id: number]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: ItemDto | null;
    };
  };
};
