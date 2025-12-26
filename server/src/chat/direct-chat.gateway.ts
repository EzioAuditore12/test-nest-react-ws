import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import type { AuthenticatedSocket } from 'src/auth/types/auth-jwt.payload';
import { ChatService } from './chat.service';

import { WSAuthMiddleware } from 'src/auth/middlewares/ws-auth.middleware';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class DirectChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    const wsAuthMiddleware = WSAuthMiddleware(this.jwtService);

    server.use(wsAuthMiddleware);
  }

  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.handshake.user.id;
    // 1. Get the room ID from the query params
    const roomId = client.handshake.query.conversationId as string;

    if (!userId) {
      client.disconnect();
      return;
    }

    // 2. IMPORTANT: Manually join the socket room
    if (roomId) {
      await client.join(roomId);
      Logger.log(`${userId} connected and joined room ${roomId}`);
    } else {
      Logger.log(`${userId} connected without a room`);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.handshake.user.id;

    Logger.log(`${userId} is connected successfully`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: AuthenticatedSocket) {
    const userId = client.handshake.user.id;

    const roomId = client.handshake.query.conversationId as string;

    Logger.log(`${userId} joining the room ${roomId}`);

    await client.join(roomId);
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(client: AuthenticatedSocket, text: string) {
    const userId = client.handshake.user.id;
    const roomId = client.handshake.query.conversationId as string;
    const receiverId = client.handshake.query.receiverId as string;

    const createdChat = await this.chatService.create(userId, {
      receiverId,
      text,
    });

    // Send to the receiver
    client.to(roomId).emit('chatMessage', createdChat);

    // RETURN the data to send it back to the sender (Acknowledgement)
    return createdChat;
  }
}
