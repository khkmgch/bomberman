import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CharacterDTO } from 'src/game/dtos/CharacterDTO';
import { RoomDTO } from 'src/game/dtos/RoomDTO';
import { UserDTO } from 'src/game/dtos/UserDTO';
import { Game } from 'src/game/models/Game';
import { Room } from 'src/game/models/Room';
import { RoomService } from 'src/room/room.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['https://bomberman-fawn.vercel.app', 'http://localhost:5173'],
  },
})
export class EventsGateway {
  constructor(@Inject(RoomService) public readonly roomService: RoomService) {}

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

  @SubscribeMessage('connect')
  //クライアント接続時
  handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]): void {
    const clientId: string =
      socket.handshake.query.clientId !== 'null'
        ? Array.isArray(socket.handshake.query.clientId)
          ? socket.handshake.query.clientId.join('')
          : socket.handshake.query.clientId
        : uuidv4();
    socket.handshake.query.clientId = clientId; // IDをセット
    socket.clientId = clientId;
    this.logger.log(`Client connected: ${socket.handshake.query.clientId}`);

    //再接続の場合
    const queryRoomId: string | string[] = socket.handshake.query.roomId;
    if (queryRoomId) {
      const roomId: string = Array.isArray(queryRoomId)
        ? queryRoomId.join('')
        : queryRoomId;
      if (this.roomService.roomExists(roomId)) {
        const room: Room = this.roomService.getRoomMap().get(roomId);
        socket.join(room.getId());
      }
    }

    // clientIdを送信
    socket.emit('ClientId', { clientId });
  }

  //クライアント切断時
  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${socket.handshake.query.clientId}`);
    //disconnectイベント発生時に、socket.leave()が自動的に行われる

    //対戦ルームから退室する
    await this.roomService.leaveRoom(socket, socket.roomId);
  }

  //ロビー入室
  @SubscribeMessage('JoinLobby')
  joinLobby(@ConnectedSocket() socket: Socket): void {
    socket.join('lobby');
  }

  //ルーム作成
  @SubscribeMessage('CreateRoom')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userName: string },
  ): Promise<{
    roomId: string;
  }> {
    const room: Room = await this.roomService.createRoom(socket, data.userName);

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
    if (socket.clientId === host.getSocket().clientId) isHost = true;

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
  getRoomUsers(@MessageBody() data: { roomId: string }): {
    users: UserDTO[];
  } {
    return { users: this.roomService.getRoomUserDTOs(data.roomId) };
  }

  //入室したことをルーム内のユーザーに通知
  @SubscribeMessage('NotifyRoomJoin')
  notifyRoomJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string },
  ): void {
    const user: UserDTO = this.roomService.getUserDTO(
      socket.clientId,
      data.roomId,
    );
    this.server.in(socket.roomId).emit('UpsertUser', { user: user });
  }

  //ゲーム開始の準備
  @SubscribeMessage('ReadyToStartGame')
  readyToStartGame(@ConnectedSocket() socket: Socket): void {
    const user: UserDTO = this.roomService.readyToStartGame(socket);
    this.server.in(socket.roomId).emit('UpsertUser', { user: user });
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
  async startGame(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      //ロビーから退室させる
      this.roomService.kickUsersFromLobby(socket.roomId);

      //ゲームオブジェクトを作成
      if (!this.roomService.roomExists(socket.roomId)) {
        throw new Error('Room not found');
      }

      //ゲームオブジェクトを作成してセット
      this.roomService
        .getRoomMap()
        .get(socket.roomId)
        .setGame(new Game(this, socket.roomId));

      //画面遷移
      this.server.in(socket.roomId).emit('LeaveLobby');
    } catch (error) {
      console.error(error);
    }
  }

  //クライアントの受信体制が整ったことを受け取る
  @SubscribeMessage('ReadyToReceiveGame')
  readyToReceiveGame(@ConnectedSocket() socket: Socket): void {
    this.roomService.readyToReceiveGame(socket);

    let interval: NodeJS.Timer = setInterval(() => {
      if (this.roomService.checkAllPlayersPlaying(socket)) {
        const game: Game = this.roomService
          .getRoomMap()
          .get(socket.roomId)
          .getGame();
        this.server.emit('GetInitialState', game.getStage().getInitialState());
        setTimeout(() => {
          game.startCountDown();
        }, 800);
        clearInterval(interval);
      }
    }, 500);
  }

  @SubscribeMessage('MovePlayer')
  movePlayer(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: {
      movement: {
        up: boolean;
        right: boolean;
        down: boolean;
        left: boolean;
      };
    },
  ): void {
    this.roomService.movePlayer(socket, data.movement);
  }

  @SubscribeMessage('PutBomb')
  putBomb(@ConnectedSocket() socket: Socket): void {
    this.roomService.putBomb(socket);
  }

  @SubscribeMessage('GetResult')
  getResult(@ConnectedSocket() socket: Socket): {
    result: CharacterDTO[];
  } {
    return this.roomService.getResult(socket);
  }

  @SubscribeMessage('LeaveResult')
  leaveResult(@ConnectedSocket() socket: Socket): {
    success: boolean;
  } {
    return this.roomService.leaveResult(socket);
  }
}
