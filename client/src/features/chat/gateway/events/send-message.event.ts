import type { RefObject } from 'react';
import ObjectID from 'bson-objectid';

import type { DirectChatSocket } from '../direct-chat.gateway';

import { DirectChatRepository } from '@/db/repositories/direct-chat';
import { ConversationRepository } from '@/db/repositories/conversation';

export interface SendMessageEventProps {
  conversationId: string;
  text: string;
  socket: RefObject<DirectChatSocket | null>;
}

export const sendMessageEvent = async ({ conversationId, socket, text }: SendMessageEventProps) => {
  if (!socket.current) return;

  const directChatRepository = new DirectChatRepository();
  const conversationRepository = new ConversationRepository();
  // 1. Generate ID and Timestamp locally
  const messageId = ObjectID().toHexString();
  const now = new Date();

  console.log(messageId);

  // 2. Create the payload matching InsertChatDto
  const payload = {
    _id: messageId,
    conversationId,
    text: text,
    createdAt: now.toISOString(), // Backend expects ISO string
  };

  // 3. Save to Local DB IMMEDIATELY (Optimistic UI)
  await directChatRepository.create({
    _id: messageId,
    conversationId,
    isDelivered: false,
    isSeen: false,
    mode: 'SENT',
    text: text,
    createdAt: now,
    updatedAt: now,
  });

  await conversationRepository.update(conversationId, {
    lastMessage: text,
    updatedAt: now,
  });

  // 4. Send the FULL OBJECT to the socket
  socket.current.emit('chatMessage', payload, async (response) => {
    // 5. Handle Acknowledgement
    if (response && response.status === 'ok') {
      // Optional: Update local DB to mark as delivered
      console.log('Server confirmed receipt');
    }
  });
};
