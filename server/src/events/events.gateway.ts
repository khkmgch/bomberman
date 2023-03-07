import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDTO } from 'src/game/dtos/RoomDTO';
import { RoomService } from 'src/room/room.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['https://bomberman-fawn.vercel.app', 'http://localhost:5173'],
  },
})
export class EventsGateway {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  //初期化
  afterInit(server: Server) {
    this.logger.log('初期化しました。');
    setInterval(() => {
      this.server.in('lobby').emit('GetRooms', {
        rooms: this.roomService.getAvailableRoomDTOs(),
      });
    }, 500);
  }

  //クライアント接続時
  handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  //クライアント切断時
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
    //disconnectイベント発生時に、socket.leave()が自動的に行われる

    //対戦ルームから退室する
    await this.roomService.leaveRoom(socket, socket.roomId);
  }

  //ロビー入室
  @SubscribeMessage('JoinLobby')
  joinLobby(@ConnectedSocket() socket: Socket) {
    socket.join('lobby');
  }

  //ルーム作成
  @SubscribeMessage('CreateRoom')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userName: string },
  ) {
    const room = await this.roomService.createRoom(socket, data.userName);

    return { roomId: room.getId() };
  }

  //ルーム入室
  @SubscribeMessage('JoinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; userName: string },
  ): Promise<{
    success: boolean;
    room: RoomDTO;
    isHost: boolean;
  }> {
    const { room, success } = await this.roomService.joinRoom(
      socket,
      data.roomId,
      data.userName,
    );

    const host = room.getHost();
    let isHost = false;
    if (socket.id === host.getSocket().id) isHost = true;

    return { success: success, room: room.toDTO(), isHost: isHost };
  }

  //ルーム退室
  @SubscribeMessage('LeaveRoom')
  async leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ): Promise<{
    success: boolean;
  }> {
    return await this.roomService.leaveRoom(socket, data.roomId);
  }

  //ルーム内の全ユーザーを取得
  @SubscribeMessage('GetRoomUsers')
  getRoomUsers(@MessageBody() data: { roomId: string }) {
    return { users: this.roomService.getRoomUserDTOs(data.roomId) };
  }

  //入室したことをルーム内のユーザーに通知
  @SubscribeMessage('NotifyRoomJoin')
  notifyRoomJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const user = this.roomService.getUserDTO(socket.id, data.roomId);
    socket.emit('UpsertUser', { user: user });
    socket.in(socket.roomId).emit('UpsertUser', { user: user });
  }

  //ゲーム開始の準備
  @SubscribeMessage('ReadyToStartGame')
  readyToStartGame(@ConnectedSocket() socket: Socket): void {
    const user = this.roomService.readyToStartGame(socket);
    socket.emit('UpsertUser', { user: user });
    socket.in(socket.roomId).emit('UpsertUser', { user: user });
  }

  //ルーム内の全ユーザーの準備が完了しているかを確認
  @SubscribeMessage('CheckAllPlayersReady')
  checkAllPlayersReady(@ConnectedSocket() socket: Socket): {
    isReady: boolean;
  } {
    return { isReady: this.roomService.checkAllPlayersReady(socket) };
  }

  //ゲームを開始
  @SubscribeMessage('StartGame')
  async startGame(@ConnectedSocket() socket: Socket) {
    //ロビーから退室させる
    this.roomService.kickUsersFromLobby(socket.roomId);

    //画面遷移
    socket.emit('LeaveLobby');
    socket.in(socket.roomId).emit('LeaveLobby');
    //await ゲームオブジェクトを作成(RoomServiceとServerを渡す)
  }
}
