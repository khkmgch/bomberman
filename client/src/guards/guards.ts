import { IRoomDTO } from '../dtos/interface/IRoomDTO';
import { IUserDTO } from '../dtos/interface/IUserDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IGameObjectDTO } from '../dtos/interface/IGameObjectDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IBombDTO } from '../dtos/interface/IBombDTO';
import { IMarkerDTO } from '../dtos/interface/IMarkerDTO';
import { IExplosionDTO } from '../dtos/interface/IExplosionDTO';
import { IItem } from '../interfaces/IItem';
import { ISyncItemsDTO } from '../dtos/interface/ISyncItemsDTO';

export class Guards {
  static isIRoomDTO(obj: any): obj is IRoomDTO {
    return (
      'id' in obj &&
      typeof obj.id === 'string' &&
      'users' in obj &&
      Array.isArray(obj.users) &&
      obj.users.every((user: any) => Guards.isIUserDTO(user)) &&
      'host' in obj &&
      Guards.isIUserDTO(obj.host) &&
      'numUsers' in obj &&
      typeof obj.numUsers === 'number' &&
      'maxUsers' in obj &&
      typeof obj.maxUsers === 'number'
    );
  }
  static isIUserDTO(obj: any): obj is IUserDTO {
    return (
      'clientId' in obj &&
      typeof obj.clientId === 'string' &&
      'id' in obj &&
      typeof obj.id === 'number' &&
      'userName' in obj &&
      typeof obj.userName === 'string' &&
      'state' in obj &&
      typeof obj.state === 'string'
    );
  }
  static isJoinRoomDTO(
    obj: any
  ): obj is { success: boolean; room: IRoomDTO; isHost: boolean } {
    return (
      obj &&
      'success' in obj &&
      typeof obj.success === 'boolean' &&
      'room' in obj &&
      Guards.isIRoomDTO(obj.room) &&
      'isHost' in obj &&
      typeof obj.isHost === 'boolean'
    );
  }
  static isCreateRoomDTO(obj: any): obj is { roomId: string } {
    return obj && 'roomId' in obj && typeof obj.roomId === 'string';
  }
  static isGetRoomsDTO(obj: any): obj is { rooms: IRoomDTO[] } {
    return (
      obj &&
      'rooms' in obj &&
      Array.isArray(obj.rooms) &&
      obj.rooms.every((room: any) => Guards.isIRoomDTO(room))
    );
  }
  static isLeaveRoomDTO(obj: any): obj is { success: boolean } {
    return obj && 'success' in obj && typeof obj.success === 'boolean';
  }
  static isUpsertUserDTO(obj: any): obj is { user: IUserDTO } {
    return obj && 'user' in obj && Guards.isIUserDTO(obj.user);
  }
  static isRemoveUserDTO(obj: any): obj is { user: IUserDTO } {
    return obj && 'user' in obj && Guards.isIUserDTO(obj.user);
  }
  static isCheckAllPlayersReadyDTO(obj: any): obj is { isReady: boolean } {
    return obj && 'isReady' in obj && typeof obj.isReady === 'boolean';
  }

  static isGetInitialStateDTO(obj: any): obj is {
    groundArr: IGroundDTO[];
    edgeObstacleArr: IEdgeObstacleDTO[];
    fixedObstacleArr: IFixedObstacleDTO[];
    breakableObstacleArr: IBreakableObstacleDTO[];
    characterArr: ICharacterDTO[];
  } {
    return (
      obj &&
      'groundArr' in obj &&
      Array.isArray(obj.groundArr) &&
      obj.groundArr.every((ground: any) => Guards.isGroundDTO(ground)) &&
      'edgeObstacleArr' in obj &&
      Array.isArray(obj.edgeObstacleArr) &&
      obj.edgeObstacleArr.every((edgeObstacle: any) =>
        Guards.isEdgeObstacleDTO(edgeObstacle)
      ) &&
      'fixedObstacleArr' in obj &&
      Array.isArray(obj.fixedObstacleArr) &&
      obj.fixedObstacleArr.every((fixedObstacle: any) =>
        Guards.isFixedObstacleDTO(fixedObstacle)
      ) &&
      'breakableObstacleArr' in obj &&
      Array.isArray(obj.breakableObstacleArr) &&
      obj.breakableObstacleArr.every((breakableObstacle: any) =>
        Guards.isBreakableObstacleDTO(breakableObstacle)
      ) &&
      'characterArr' in obj &&
      Array.isArray(obj.characterArr) &&
      obj.characterArr.every((character: any) =>
        Guards.isCharacterDTO(character)
      )
    );
  }
  static isGroundDTO(obj: any): obj is IGroundDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isEdgeObstacleDTO(obj: any): obj is IEdgeObstacleDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isFixedObstacleDTO(obj: any): obj is IFixedObstacleDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isBreakableObstacleDTO(obj: any): obj is IBreakableObstacleDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isCharacterDTO(obj: any): obj is ICharacterDTO {
    // console.log(obj);
    // console.log(
    //   Guards.isGameObjectDTO(obj) &&
    //     'name' in obj &&
    //     typeof obj.name === 'string' &&
    //     'direction' in obj &&
    //     typeof obj.direction === 'number' &&
    //     'stock' in obj &&
    //     typeof obj.stock === 'number' &&
    //     'initStock' in obj &&
    //     typeof obj.initStock === 'number'
    // );
    return (
      Guards.isGameObjectDTO(obj) &&
      'name' in obj &&
      typeof obj.name === 'string' &&
      'direction' in obj &&
      typeof obj.direction === 'number' &&
      'stock' in obj &&
      typeof obj.stock === 'number' &&
      'initStock' in obj &&
      typeof obj.initStock === 'number'
    );
  }
  static isGameObjectDTO(obj: any): obj is IGameObjectDTO {
    return (
      'id' in obj &&
      typeof obj.id === 'number' &&
      'x' in obj &&
      typeof obj.x === 'number' &&
      'y' in obj &&
      typeof obj.y === 'number' &&
      'size' in obj &&
      typeof obj.size === 'number' &&
      'spriteKey' in obj &&
      typeof obj.spriteKey === 'string' &&
      'animation' in obj &&
      typeof obj.animation === 'string'
    );
  }
  static isSyncTimeDTO(obj: any): boolean {
    return 'timeStr' in obj && typeof obj.timeStr === 'string';
  }
  static isAddBombDTO(obj: any) {
    return 'bomb' in obj && Guards.isIBombDTO(obj.bomb);
  }
  static isIBombDTO(obj: any): obj is IBombDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isRemoveBombDTO(obj: any): boolean {
    return 'id' in obj && typeof obj.id === 'number';
  }
  static isAddMarkersDTO(obj: any) {
    return (
      'markerArr' in obj &&
      Array.isArray(obj.markerArr) &&
      obj.markerArr.every((marker: any) => Guards.isIMarkerDTO(marker))
    );
  }
  static isIMarkerDTO(obj: any): obj is IMarkerDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isRemoveMarkersDTO(obj: any): boolean {
    return (
      'idArr' in obj &&
      Array.isArray(obj.idArr) &&
      obj.idArr.every((id: any) => typeof id === 'number')
    );
  }
  static isAddExplosionsDTO(obj: any) {
    return (
      'explosionArr' in obj &&
      Array.isArray(obj.explosionArr) &&
      obj.explosionArr.every((explosion: any) =>
        Guards.isIExplosionDTO(explosion)
      )
    );
  }
  static isIExplosionDTO(obj: any): obj is IExplosionDTO {
    return Guards.isGameObjectDTO(obj);
  }
  static isRemoveExplosionsDTO(obj: any) {
    return (
      'idArr' in obj &&
      Array.isArray(obj.idArr) &&
      obj.idArr.every((id: any) => typeof id === 'number')
    );
  }
  static isRemoveBreakableObstacleDTO(obj: any) {
    return 'id' in obj && typeof obj.id === 'number';
  }

  static isAddItemDTO(obj: any) {
    return 'item' in obj && Guards.isIItemDTO(obj.item);
  }
  static isIItemDTO(obj: any): obj is IItem {
    return Guards.isGameObjectDTO(obj);
  }
  static isRemoveItemDTO(obj: any): boolean {
    return 'id' in obj && typeof obj.id === 'number';
  }
  static isDamagedDTO(obj: any): boolean {
    return 'id' in obj && typeof obj.id === 'number';
  }
  static isDeadDTO(obj: any): boolean {
    return 'id' in obj && typeof obj.id === 'number';
  }
  static isISyncItemsDTO(obj: any): obj is ISyncItemsDTO {
    return (
      'fireUp' in obj &&
      typeof obj.fireUp === 'number' &&
      'bombUp' in obj &&
      typeof obj.bombUp === 'number' &&
      'speedUp' in obj &&
      typeof obj.speedUp === 'number' &&
      'healUp' in obj &&
      typeof obj.healUp === 'number'
    );
  }
  static isSyncItemsDTO(obj: any): boolean {
    return 'items' in obj && Guards.isISyncItemsDTO(obj.items);
  }
  static isCountDownDTO(obj: any): boolean {
    return 'countDown' in obj && typeof obj.countDown === 'number';
  }
}
