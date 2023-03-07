import Constant from 'src/constant';
import { Room } from '../models/Room';
import { UserDTO } from './UserDTO';

export class RoomDTO {
  private id: string;
  private host: UserDTO;
  private users: UserDTO[];
  private numUsers: number;
  private maxUsers: number = Constant.MAX_PLAYERS_PER_ROOM;

  constructor() {}

  public setId(id: string): void {
    this.id = id;
  }
  public setHost(host: UserDTO): void {
    this.host = host;
  }
  public setUsers(users: UserDTO[]): void {
    this.users = users;
  }
  public setNumUsers(num: number): void {
    this.numUsers = num;
  }
}
