import { UserDTO } from './UserDTO';

export class RoomDTO {
  public id: string;
  public host: UserDTO;
  public users: UserDTO[];
  public numUsers: number;
  public maxUsers: number;
}
