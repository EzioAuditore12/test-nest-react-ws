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
} from 'src/auth/types/auth-jwt.payload';

// 1. REMOVE @UseGuards(WsJwtGuard)
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;
  ROOM_NAME = 'GROUP';

  constructor(private readonly jwtService: JwtService) {}

  // 2. This Middleware is now your ONLY security layer.
  // It runs ONCE when the user connects.
  afterInit(server: Server) {
    server.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token as string;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const payload: AuthJwtPayload = this.jwtService.verify(token);

        // We attach the user here. Since the socket object persists,
        // this data will be available in all SubscribeMessage handlers.
        socket.handshake.user = { id: payload.sub };

        next();
      } catch {
        next(new Error('Authentication error: Token expired or invalid'));
      }
    });
  }

  handleConnection(client: Socket) {
    Logger.log('Client has been connected', client.id);
  }

  handleDisconnect() {
    Logger.log('client has been disconnected');
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
    // No CPU overhead here anymore. We trust the socket.
    client.to(this.ROOM_NAME).emit('chatMessage', payload);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, username: string) {
    client.to(this.ROOM_NAME).emit('typing', username);
  }
}
