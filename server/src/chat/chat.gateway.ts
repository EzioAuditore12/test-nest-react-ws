import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import type { AuthenticatedSocket } from 'src/auth/types/auth-jwt.payload';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  ROOM_NAME = 'GROUP';

  constructor(private readonly chatService: ChatService) {}

  afterInit(): void {
    Logger.log('Init');
  }

  handleConnection(client: Socket) {
    Logger.log('Client has been connected', client.id);
  }

  handleDisconnect() {
    Logger.log('client has been disconnected');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: AuthenticatedSocket, username: string) {
    Logger.log(`${username} joining the room`);

    const id = client.handshake.user.id;

    Logger.log('user with id joiing room ', id);

    await client.join(this.ROOM_NAME);

    client.to(this.ROOM_NAME).emit('roomNotice', username);

    Logger.log('Received', username);
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, payload: { data: string; sender: string }) {
    Logger.log(payload);
    // Broadcast the full data object (text + sender)
    client.to(this.ROOM_NAME).emit('chatMessage', payload);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, username: string) {
    client.to(this.ROOM_NAME).emit('typing', username);
  }
}
