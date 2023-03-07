import { User } from './User';
import { v4 as uuidv4 } from 'uuid';
import { Game } from 'src/game/Game';
import { RoomDTO } from '../dtos/RoomDTO';
import { UserDTO } from '../dtos/UserDTO';

export class Room {
  private id: string = uuidv4();
  private userMap: Map<string, User> = new Map<string, User>();
  private game: Game = null;
  private isRemoving: boolean = false;
  private isLocked: boolean = false;

  constructor(private host: User) {}

  public toDTO(): RoomDTO {
    const dto = new RoomDTO();
    dto.setId(this.getId());
    dto.setHost(this.getHost().toDTO());

    let userDTOs: UserDTO[] = [];
    for (let user of this.getUserMap()) {
      userDTOs.push(user[1].toDTO());
    }
    dto.setUsers(userDTOs);
    dto.setNumUsers(userDTOs.length);
    return dto;
  }
  public getId(): string {
    return this.id;
  }
  public getHost(): User {
    return this.host;
  }
  public getUserMap(): Map<string, User> {
    return this.userMap;
  }
  public getGame(): Game {
    return this.game;
  }
  public getIsRemoving(): boolean {
    return this.isRemoving;
  }
  public getIsLocked(): boolean {
    return this.isLocked;
  }

  public setUser(user: User): void {
    this.userMap.set(user.getSocket().id, user);
  }
  public setGame(game: Game): void {
    this.game = game;
  }
  public setIsRemoving(isRemoving: boolean): void {
    this.isRemoving = isRemoving;
  }
  public setIsLocked(isLocked: boolean): void {
    this.isLocked = isLocked;
  }

  public hasUser(socketId: string): boolean {
    return this.userMap.has(socketId);
  }
}
