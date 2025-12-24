import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  ROOM_NAME = 'GROUP';

  constructor(private readonly chatService: ChatService) {}

  handleConnection(conn: { id: string }) {
    Logger.log('Client has been connected', conn.id);
  }

  handleDisconnect() {
    Logger.log('client has been disconnected');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, username: string) {
    Logger.log(`${username} joining the room`);

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
