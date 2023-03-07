import { IRoomDTO } from '../dtos/IRoomDTO';
import { IUserDTO } from '../dtos/IUserDTO';

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
}
