import { IUserDTO } from './IUserDTO';

export interface IRoomDTO {
  id: string;
  host: IUserDTO;
  users: IUserDTO[];
  numUsers: number;
  maxUsers: number;
}
