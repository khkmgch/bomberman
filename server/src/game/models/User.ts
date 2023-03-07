import { Socket } from 'socket.io';
import Constant from 'src/constant';
import { UserDTO } from '../dtos/UserDTO';

export class User {
  private updatedAt: number = Date.now();
  private state: string = Constant.PLAYER_STATE.WAITING;
  constructor(
    private socket: Socket,
    private id: number,
    private userName: string,
  ) {}

  public toDTO(): UserDTO {
    const dto = new UserDTO();
    dto.setSocketId(this.getSocket().id);
    dto.setId(this.getId());
    dto.setUserName(this.getUserName());
    dto.setState(this.getState());
    return dto;
  }

  public getSocket(): Socket {
    return this.socket;
  }
  public getId(): number {
    return this.id;
  }
  public getState(): string {
    return this.state;
  }

  public getUserName(): string {
    return this.userName;
  }
  public getUpdatedAt(): number {
    return this.updatedAt;
  }

  public setState(state: string): void {
    this.state = state;
  }
}
