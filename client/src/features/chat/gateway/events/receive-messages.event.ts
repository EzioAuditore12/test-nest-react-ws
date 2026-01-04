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
    // Only connect if not already connected (optional safety check)
    if (!socket.current) {
      socket.current = connectDirectChatWebSocket({ conversationId, receiverId });
    }

    // 2. Listen
    socket.current.on('chatMessage', async (data) => {
      console.log('Received message:', data); // Debug log

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

    // 3. CLEANUP
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
    // Add dependency array so this only runs once on mount/unmount
  }, [conversationId, receiverId, socket]); // <-- Fixed dependency array
};
