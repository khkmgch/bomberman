import { User } from './User';
import { v4 as uuidv4 } from 'uuid';
import { Game } from 'src/game/models/Game';
import { RoomDTO } from '../dtos/RoomDTO';
import { UserDTO } from '../dtos/UserDTO';
import Constant from 'src/constant';

export class Room {
  private id: string = uuidv4();
  private userMap: Map<string, User> = new Map<string, User>();
  private game: Game = null;
  private isRemoving: boolean = false;
  private isLocked: boolean = false;

  constructor(private host: User) {}

  public toDTO(): RoomDTO {
    let userDTOs: UserDTO[] = [];
    for (let user of this.getUserMap()) {
      userDTOs.push(user[1].toDTO());
    }
    return {
      id: this.getId(),
      host: this.getHost().toDTO(),
      users: userDTOs,
      numUsers: userDTOs.length,
      maxUsers: Constant.MAX_PLAYERS_PER_ROOM,
    };
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
    this.userMap.set(user.getSocket().clientId, user);
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

  public hasUser(clientId: string): boolean {
    return this.userMap.has(clientId);
  }
}
