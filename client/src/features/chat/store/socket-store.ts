import { create } from 'zustand';
import { io } from 'socket.io-client';

import { env } from '@/env';

import type { SocketStore } from './type';

import { useAuthStore } from '@/store/auth';

import { DirectChatRepository } from '@/db/repositories/direct-chat';

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const socket = get().socket;
    const token = useAuthStore.getState().tokens?.accessToken;

    if (!token || socket?.connect) return;

    const newSocket = io(env.SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Global Socket Connected:', newSocket.id);
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Global Socket Disconnected');
      set({ isConnected: false });
    });

    newSocket.on('chatMessage', async (data) => {
      console.log('Received message globally:', data);
      const directChatRepository = new DirectChatRepository();

      // Write to WatermelonDB - The UI will update automatically!
      await directChatRepository.create({
        _id: data._id,
        conversationId: data.conversationId,
        isDelivered: false,
        isSeen: false,
        mode: 'RECEIVED',
        text: data.text,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt),
      });
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinConversation: (conversationId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('joinRoom', { conversationId }); // Ensure server expects object or string
    }
  },

  leaveConversation: (conversationId) => {},
}));
