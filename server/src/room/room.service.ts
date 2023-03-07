import { Injectable } from '@nestjs/common';
import { constants } from 'buffer';
import { Socket } from 'socket.io';
import Constant from 'src/constant';
import { RoomDTO } from 'src/game/dtos/RoomDTO';
import { UserDTO } from 'src/game/dtos/UserDTO';

import { Room } from '../game/models/Room';
import { User } from '../game/models/User';

@Injectable()
export class RoomService {
  private roomMap: Map<string, Room> = new Map<string, Room>();

  constructor() {
    setInterval(() => {
      this.removeInactiveRooms();
    }, 10000);
  }

  //入室可能な全ルームを返す
  getAvailableRoomDTOs(): RoomDTO[] {
    let rooms: RoomDTO[] = [];
    this.roomMap.forEach((room) => {
      if (!room.getIsRemoving() && !room.getIsLocked()) {
        rooms.push(room.toDTO());
      }
    });
    return rooms;
  }
  //ルーム内の全ユーザーを返す
  getRoomUserDTOs(roomId: string): UserDTO[] {
    if (!this.roomExists(roomId)) return null;

    const room = this.roomMap.get(roomId);

    if (room.getIsRemoving()) return null;

    let users: UserDTO[] = [];
    room.getUserMap().forEach((user) => {
      users.push(user.toDTO());
    });
    return users;
  }
  //特定のユーザーを返す
  getUserDTO(socketId: string, roomId: string): UserDTO {
    if (!this.userExists(roomId, socketId)) return null;

    return this.roomMap.get(roomId).getUserMap().get(socketId).toDTO();
  }
  //ルームを作成
  async createRoom(socket: Socket, userName: string): Promise<Room> {
    try {
      if (userName !== '' && userName.length <= 8) {
        const host: User = new User(socket, 0, userName);
        const room: Room = new Room(host);
        this.roomMap.set(room.getId(), room);

        return room;
      } else {
        throw new Error(
          'Must be at least 1 character, not to exceed 8 characters.',
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
  //入室
  async joinRoom(
    socket: Socket,
    roomId: string,
    userName: string,
  ): Promise<{ room: Room; success: boolean }> {
    try {
      if (userName !== '' && userName.length <= 8) {
        //ルームがない場合
        if (!this.roomExists(roomId)) return { room: null, success: false };

        const room = this.roomMap.get(roomId);
        //ルームが削除中、または鍵がかかっている場合
        if (room.getIsRemoving() || room.getIsLocked())
          return { room, success: false };

        //ユーザーが既に存在する場合
        if (room.hasUser(socket.id)) return { room, success: false };

        //ユーザーを追加
        this.addUser(socket, userName, room);

        //定員に達した場合は鍵をかける
        if (room.getUserMap().size >= Constant.MAX_PLAYERS_PER_ROOM) {
          room.setIsLocked(true);
        }

        return { room, success: true };
      } else {
        throw new Error(
          'Must be at least 1 character, not to exceed 8 characters.',
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  //退室
  async leaveRoom(
    socket: Socket,
    roomId: string,
  ): Promise<{
    success: boolean;
  }> {
    //ルームがない場合
    if (!this.roomExists(roomId)) return { success: false };

    const room = this.roomMap.get(roomId);
    //ルームが削除中の場合
    if (room.getIsRemoving()) return { success: false };

    //ユーザーが存在しない場合
    if (!room.hasUser(socket.id)) return { success: false };

    //ユーザーを削除
    this.removeUser(socket, roomId);

    //鍵がかかっている場合は、開錠する
    if (
      room.getIsLocked() &&
      room.getUserMap().size < Constant.MAX_PLAYERS_PER_ROOM
    ) {
      room.setIsLocked(false);
    }

    //ユーザーがルームのホストの場合、ルームを削除する
    if (socket.id === room.getHost().getSocket().id) {
      socket.in(roomId).emit('CloseRoomDialog');
      await this.removeRoom(roomId);
    }

    return { success: true };
  }

  //ルーム削除
  async removeRoom(roomId: string): Promise<void> {
    //ルームがない場合
    if (!this.roomExists(roomId)) return;

    const room = this.roomMap.get(roomId);
    //ルームが削除中の場合
    if (room.getIsRemoving()) return;

    //ルームにいるユーザーを退出させる
    for (let user of room.getUserMap()) {
      this.removeUser(user[1].getSocket(), roomId);
    }

    //ルームのステータスを削除中に設定
    room.setIsRemoving(true);

    //ルームを削除
    this.roomMap.delete(roomId);
  }

  //ルームにユーザーを追加
  addUser(socket: Socket, userName: string, room: Room): void {
    //ルーム内でのidを割り当てる
    let id: number = 0;
    let map = new Map<number, User>();
    for (const user of room.getUserMap().values()) {
      map.set(user.getId(), user);
    }
    while (id < Constant.MAX_PLAYERS_PER_ROOM) {
      if (!map.has(id)) break;
      else id++;
    }

    //ユーザーオブジェクトを作成
    //ここでspritekeyを割り当てる？
    const user: User = new User(socket, id, userName);
    room.setUser(user);

    socket.join(room.getId());
    socket.roomId = room.getId();
  }

  //ルームからユーザーを削除
  removeUser(socket: Socket, roomId: string): void {
    const user = this.roomMap.get(roomId).getUserMap().get(socket.id);
    socket.emit('RemoveUser', { user: user.toDTO() });
    socket.in(roomId).emit('RemoveUser', { user: user.toDTO() });

    //ユーザーをRoomsから外す
    socket.leave(roomId);
    socket.roomId = '';
    if (!this.userExists(roomId, socket.id)) return;

    //ルームのuserMapから削除
    this.roomMap.get(roomId).getUserMap().delete(socket.id);
  }

  //ゲーム開始の準備
  readyToStartGame(socket: Socket): UserDTO {
    try {
      if (socket.roomId !== '') {
        if (this.userExists(socket.roomId, socket.id)) {
          const user = this.roomMap
            .get(socket.roomId)
            .getUserMap()
            .get(socket.id);
          user.setState(Constant.PLAYER_STATE.READY);
          return user.toDTO();
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('Socket has not roomId');
      }
    } catch (error) {
      console.error(error);
    }
  }

  //ルーム内の全ユーザーの準備が完了しているかを確認
  checkAllPlayersReady(socket: Socket): boolean {
    try {
      if (socket.roomId !== '') {
        if (this.roomExists(socket.roomId)) {
          for (const user of this.roomMap.get(socket.roomId).getUserMap()) {
            if (user[1].getState() !== Constant.PLAYER_STATE.READY)
              return false;
          }
          return true;
        } else {
          throw new Error('Room not found');
        }
      } else {
        throw new Error('Socket has not roomId');
      }
    } catch (error) {
      console.error(error);
    }
  }

  //ルーム内の全ユーザーをロビーから退室させる
  async kickUsersFromLobby(roomId: string): Promise<void> {
    try {
      if (roomId !== '') {
        if (this.roomExists(roomId)) {
          for (const user of this.roomMap.get(roomId).getUserMap()) {
            user[1].getSocket().leave('lobby');
          }
        } else {
          throw new Error('Room not found');
        }
      } else {
        throw new Error('Invalid roomId');
      }
    } catch (error) {
      console.error(error);
    }
  }

  //ルーム内に特定のユーザーが存在するかどうか
  userExists(roomId: string, socketId: string): boolean {
    return (
      this.roomExists(roomId) &&
      this.roomMap.get(roomId).getUserMap() &&
      this.roomMap.get(roomId).getUserMap().has(socketId)
    );
  }
  //特定のルームが存在するかどうか
  roomExists(roomId: string): boolean {
    return this.roomMap && this.roomMap.has(roomId);
  }

  //使用されていないルームを削除する
  removeInactiveRooms(): void {
    this.roomMap.forEach((room: Room, roomId: string) => {
      if (room.getUserMap().size <= 0) this.removeRoom(roomId);
    });
  }
}