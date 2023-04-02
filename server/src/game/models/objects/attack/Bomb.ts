import { BombDTO } from 'src/game/dtos/BombDTO';
import { ExplosionDTO } from 'src/game/dtos/ExplosionDTO';
import { MarkerDTO } from 'src/game/dtos/MarkerDTO';
import { IStage } from 'src/game/interfaces/stage/IStage';
import { Index } from 'src/game/types/Index';
import { Position } from 'src/game/types/Position';
import { BombManager } from '../../managers/BombManager';
import { ExplosionManager } from '../../managers/ExplosionManager';
import { MarkerManager } from '../../managers/MarkerManager';
import { GrassStage } from '../../stages/grass/GrassStage';
import { BreakableObstacle } from '../map/obstacle/BreakableObstacle';
import { Character } from '../character/Character';
import { Explosion } from './Explosion';
import { FixedObstacle } from '../map/obstacle/FixedObstacle';
import { GameObject } from '../GameObject';
import { Marker } from './Marker';
import { Item } from '../item/Item';
import { Cell } from 'src/game/types/Cell';

export class Bomb extends GameObject {
  private marker: {
    top: Marker[];
    right: Marker[];
    down: Marker[];
    left: Marker[];
  } = {
    top: [],
    right: [],
    down: [],
    left: [],
  };
  private explosionMap: Map<number, Explosion> = new Map<number, Explosion>();

  constructor(
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    private character: Character,
    private stage: IStage,
  ) {
    super(id, x, y, spriteKey, `${spriteKey}-anim`);

    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('AddBomb', { bomb: this.toDTO() });

    this.addMarkers();
    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('AddMarkers', { markerArr: this.getMarkerDTOs() });

    setTimeout(() => {
      this.explode();
    }, 3000);
  }

  public toDTO(): BombDTO {
    return super.toDTO();
  }
  private getMarkerDTOs() {
    const markerDTOs: MarkerDTO[] = [];

    for (const direction in this.marker) {
      if (Object.prototype.hasOwnProperty.call(this.marker, direction)) {
        const markers: Marker[] = this.marker[direction];
        for (const marker of markers) {
          markerDTOs.push(marker.toDTO());
        }
      }
    }
    return markerDTOs;
  }
  private getMarkerIds(): number[] {
    const ids: number[] = [];
    for (const direction in this.marker) {
      if (Object.prototype.hasOwnProperty.call(this.marker, direction)) {
        const markers: Marker[] = this.marker[direction];
        for (const marker of markers) {
          ids.push(marker.getId());
        }
      }
    }
    return ids;
  }
  private addMarkers() {
    const map: Cell[][] = this.stage.getMap();
    const { i: centerI, j: centerJ }: Index = this.getIndex();
    //上
    this.addMarkersInDirection(centerI, centerJ - 1, 0, -1, map);
    //右
    this.addMarkersInDirection(centerI + 1, centerJ, 1, 0, map);
    //下
    this.addMarkersInDirection(centerI, centerJ + 1, 0, 1, map);
    //左
    this.addMarkersInDirection(centerI - 1, centerJ, -1, 0, map);
  }
  private addMarkersInDirection(
    i: number,
    j: number,
    di: number,
    dj: number,
    map: Cell[][],
  ) {
    for (
      let k: number = 0;
      k < this.character.getExplosionRange() &&
      0 < i &&
      i < this.stage.getCols() - 1 &&
      0 < j &&
      j < this.stage.getRows() - 1;
      k++, i += di, j += dj
    ) {
      const cell: Cell = map[i][j];
      if (cell.entity instanceof FixedObstacle) break;
      else if (cell.entity instanceof BreakableObstacle) {
        this.addMarker(i, j);
        break;
      } else this.addMarker(i, j);
    }
  }
  private addMarker(i: number, j: number) {
    const markerManager: MarkerManager = this.stage.getMarkerManager();
    const id = markerManager.getCurrId();
    markerManager.incrementCurrId();
    const { x, y }: Position = {
      x: i * this.stage.getTileSize(),
      y: j * this.stage.getTileSize(),
    };
    const marker: Marker = new Marker(
      id,
      x,
      y,
      GrassStage.SPRITE_KEY_MAP.ATTACK.MARKER,
    );
    //markerManagerに追加
    markerManager.getMap().set(id, marker);
    //配列にpush
    this.marker.top.push(marker);
  }
  private explode() {
    const bombMap: Map<number, Bomb> = this.character.getBombMap();
    const bombManager: BombManager = this.stage.getBombManager();

    if (!(bombMap.has(this.id) && bombManager.getMap().has(this.id))) return;

    bombMap.delete(this.id);
    bombManager.getMap().delete(this.id);

    const { i, j }: Index = this.getIndex();
    this.stage.getMap()[i][j].entity = null;

    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('RemoveBomb', { id: this.id });

    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('RemoveMarkers', { idArr: this.getMarkerIds() });

    this.addExplosions();
    this.stage
      .getEventGateway()
      .server.in(this.stage.getRoomId())
      .emit('AddExplosions', { explosionArr: this.getExplosionDTOs() });
    setTimeout(() => {
      const explosionIds: number[] = this.getExplosionIds();
      this.removeExplosions();
      this.stage
        .getEventGateway()
        .server.in(this.stage.getRoomId())
        .emit('RemoveExplosions', { idArr: explosionIds });
    }, 1000);
  }
  private addExplosions(): void {
    //中心（爆弾の位置）
    const { x, y }: Position = this.getPosition();
    const { i, j }: Index = this.getIndex();
    this.addExplosion(x, y, i, j);
    //爆弾の周辺
    for (const direction in this.marker) {
      if (Object.prototype.hasOwnProperty.call(this.marker, direction)) {
        const markers: Marker[] = this.marker[direction];
        for (const marker of markers) {
          const { x, y }: Position = marker.getPosition();
          const { i, j }: Index = marker.getIndex();
          this.addExplosion(x, y, i, j);
        }
      }
    }
  }
  private addExplosion(x: number, y: number, i: number, j: number): void {
    const map: Cell[][] = this.stage.getMap();
    const explosionManager: ExplosionManager = this.stage.getExplosionManager();

    const id: number = explosionManager.getCurrId();
    explosionManager.incrementCurrId();

    const explosion: Explosion = new Explosion(
      id,
      x,
      y,
      GrassStage.SPRITE_KEY_MAP.ATTACK.EXPLOSION,
      this.character,
      this.stage,
    );

    const cell: Cell = map[i][j];
    if (cell.entity instanceof BreakableObstacle) {
      const breakableObstacle: BreakableObstacle = cell.entity;

      map[i][j].entity = null;

      this.stage
        .getEventGateway()
        .server.in(this.stage.getRoomId())
        .emit('RemoveBreakableObstacle', { id: breakableObstacle.getId() });

      if (Math.random() < 0.5) {
        const item: Item = breakableObstacle.spawnItem(this.stage);
        map[i][j].item = item;

        this.stage
          .getEventGateway()
          .server.in(this.stage.getRoomId())
          .emit('AddItem', { item: item.toDTO() });
      }
    } else {
      map[i][j].entity = explosion;
    }
    // explosionManager.getMap().set(id, explosion);
    this.explosionMap.set(id, explosion);
  }
  private getExplosionDTOs(): ExplosionDTO[] {
    const arr: ExplosionDTO[] = [];
    this.explosionMap.forEach((explosion: Explosion) => {
      arr.push(explosion.toDTO());
    });
    return arr;
  }
  private getExplosionIds(): number[] {
    const ids: number[] = [];
    this.explosionMap.forEach((explosion: Explosion) => {
      ids.push(explosion.getId());
    });
    return ids;
  }
  private removeExplosions(): void {
    this.explosionMap.forEach((explosion: Explosion) => {
      this.removeExplosion(explosion);
    });
  }
  private removeExplosion(explosion: Explosion): void {
    const map: Cell[][] = this.stage.getMap();
    const { i, j }: Index = explosion.getIndex();
    if (0 <= i && i <= map.length - 1) {
      if (0 <= j && j <= map[i].length - 1) {
        map[i][j].entity = null;
      }
    }
    if (this.explosionMap.has(explosion.getId())) {
      this.explosionMap.delete(explosion.getId());
    }
  }
}
