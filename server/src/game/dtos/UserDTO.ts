export class UserDTO {
  private socketId: string;
  private id: number;
  private userName: string;
  private state: string;

  constructor() {}

  public setSocketId(socketId: string): void {
    this.socketId = socketId;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public setUserName(userName: string): void {
    this.userName = userName;
  }
  public setState(state: string): void {
    this.state = state;
  }
}
