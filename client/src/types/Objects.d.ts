import { IBomb } from '../interfaces/IBomb';
import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IExplosion } from '../interfaces/IExplosion';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';
import { IItem } from '../interfaces/IItem';
import { IMarker } from '../interfaces/IMarker';

export type Objects = {
  characterMap: Map<number, ICharacter>;
  groundMap: Map<number, IGround>;
  breakableObstacleMap: Map<number, IBreakableObstacle>;
  fixedObstacleMap: Map<number, IFixedObstacle>;
  edgeObstacleMap: Map<number, IEdgeObstacle>;
  bombMap: Map<number, IBomb>;
  markerMap: Map<number, IMarker>;
  explosionMap: Map<number, IExplosion>;
  itemMap: Map<number, IItem>;
};
