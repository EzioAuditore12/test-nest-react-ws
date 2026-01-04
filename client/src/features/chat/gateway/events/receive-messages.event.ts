import { useEffect, type RefObject } from 'react';
import { connectDirectChatWebSocket, type DirectChatSocket } from '../direct-chat.gateway';

import { DirectChatRepository } from '@/db/repositories/direct-chat';
import { ConversationRepository } from '@/db/repositories/conversation';

interface ReceiveMessagesProps {
  socket: RefObject<DirectChatSocket | null>;
  conversationId: string;
  receiverId: string;
}

const directChatRepository = new DirectChatRepository();
const conversationRepository = new ConversationRepository();

export const useReceiveMessages = ({
  socket,
  conversationId,
  receiverId,
}: ReceiveMessagesProps) => {
  useEffect(() => {
    // 1. Connect
    socket.current = connectDirectChatWebSocket({ conversationId, receiverId });

    // 2. Listen
    socket.current.on('chatMessage', async (data) => {
      await directChatRepository.create({
        _id: data._id,
        conversationId,
        isDelivered: false,
        isSeen: false,
        mode: 'RECEIVED',
        text: data.text,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt),
      });

      await conversationRepository.update(conversationId, {
        lastMessage: data.text,
        updatedAt: new Date(data.updatedAt),
      });
    });

    // 3. CLEANUP: Disconnect the socket when leaving the screen
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  });
};
