import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common'; // Removed UseGuards
import { JwtService } from '@nestjs/jwt';
import type {
  AuthenticatedSocket,
  AuthJwtPayload,
  SocketError,
} from 'src/auth/types/auth-jwt.payload';

// 1. REMOVE @UseGuards(WsJwtGuard)
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;
  ROOM_NAME = 'GROUP';

  ONLINE_USERS = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  // 2. This Middleware is now your ONLY security layer.
  // It runs ONCE when the user connects.
  afterInit(server: Server) {
    server.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token as string;

      if (!token) {
        // Fix 1: Create a standard Error
        const err = new Error('Token is needed') as SocketError;
        // Fix 2: Attach the status manually so client can read err.data.status
        err.data = { status: 401 };
        // Fix 3: Pass it to next(), don't just return it
        return next(err);
      }

      try {
        const payload: AuthJwtPayload = this.jwtService.verify(token);

        socket.handshake.user = { id: payload.sub };

        next();
      } catch {
        // Fix 4: Same here for invalid tokens
        const err = new Error('Token is needed') as SocketError;
        // Fix 2: Attach the status manually so client can read err.data.status
        err.data = { status: 401 };
        // Fix 3: Pass it to next(), don't just return it
        return next(err);
      }
    });
  }

  handleConnection(client: AuthenticatedSocket) {
    const userId = client.handshake.user.id;

    if (!userId) {
      client.disconnect();
      return;
    }

    const newSocketId = client.id;

    this.ONLINE_USERS.set(userId, newSocketId);

    this.server.emit('online:users', Array.from(this.ONLINE_USERS.keys()));
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.handshake.user.id;

    const newSocketId = client.id;

    if (this.ONLINE_USERS.get(userId) === newSocketId) {
      if (userId) this.ONLINE_USERS.delete(userId);

      this.server.emit('online:users', Array.from(this.ONLINE_USERS.keys()));
    }

    Logger.log('socket disconnected', {
      userId,
      newSocketId,
    });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: AuthenticatedSocket, username: string) {
    // 3. You can still access the user because the Middleware attached it!
    const id = client.handshake.user.id;

    Logger.log('user with id joining room ', id);
    await client.join(this.ROOM_NAME);
    client.to(this.ROOM_NAME).emit('roomNotice', username);
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    client: AuthenticatedSocket,
    payload: { data: string; sender: string },
  ) {
    Logger.log(payload);
    client.to(this.ROOM_NAME).emit('chatMessage', payload);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, username: string) {
    client.to(this.ROOM_NAME).emit('typing', username);
  }
}
