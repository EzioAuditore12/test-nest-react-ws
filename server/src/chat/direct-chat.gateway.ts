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
import { InsertChatDto } from './dto/insert-chat.dto'; // Ensure this is imported

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
  async handleChatMessage(
    client: AuthenticatedSocket,
    payload: InsertChatDto, // 1. Accept the full DTO object
  ) {
    const userId = client.handshake.user.id;

    // 2. Pass the full payload (including _id and createdAt) to the service
    const createdChat = await this.chatService.insertChat(userId, payload);

    // 3. Send to the receiver (using conversationId from payload)
    client.to(payload.conversationId).emit('chatMessage', createdChat);

    // 4. RETURN the status object. This becomes the 'response' in the frontend callback.
    return { status: 'ok', data: createdChat };
  }
}
