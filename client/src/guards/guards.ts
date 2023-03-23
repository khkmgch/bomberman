import { IRoomDTO } from '../dtos/interface/IRoomDTO';
import { IUserDTO } from '../dtos/interface/IUserDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IGameObjectDTO } from '../dtos/interface/IGameObjectDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';

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
      'socketId' in obj &&
      typeof obj.socketId === 'string' &&
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
    return (
      Guards.isGameObjectDTO(obj) && 'id' in obj && typeof obj.id === 'number'
    );
  }
  static isEdgeObstacleDTO(obj: any): obj is IEdgeObstacleDTO {
    return (
      Guards.isGameObjectDTO(obj) && 'id' in obj && typeof obj.id === 'number'
    );
  }
  static isFixedObstacleDTO(obj: any): obj is IFixedObstacleDTO {
    return (
      Guards.isGameObjectDTO(obj) && 'id' in obj && typeof obj.id === 'number'
    );
  }
  static isBreakableObstacleDTO(obj: any): obj is IBreakableObstacleDTO {
    return (
      Guards.isGameObjectDTO(obj) && 'id' in obj && typeof obj.id === 'number'
    );
  }
  static isCharacterDTO(obj: any): obj is ICharacterDTO {
    return (
      Guards.isGameObjectDTO(obj) &&
      'id' in obj &&
      typeof obj.id === 'number' &&
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

  id: number;
  name: string;
  direction: number;
  stock: number;
  initStock: number;
}
