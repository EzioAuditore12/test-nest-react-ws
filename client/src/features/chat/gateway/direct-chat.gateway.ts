import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { handleWsTokenRefresh, type SocketError } from './ws-token-refresh';
import { type CreateChatResponse } from '../schemas/create-chat/create-chat-response.schema';
import { InsertChatParam } from '../schemas/insert-chat/insert-chat.params';
import { InsertChatResponse } from '../schemas/insert-chat/insert-chat-response.schema';

// Events sent FROM the server TO the client
interface ServerToClientEvents {
  chatMessage: (data: CreateChatResponse) => void;
}

// Events sent FROM the client TO the server
interface ClientToServerEvents {
  joinRoom: () => void;
  // filepath: d:\FullStack_Placement_Projects\KnoziChat\test-nest-react-ws\client\features\chat\gateway\direct-chat.gateway.ts
  chatMessage: (
    insertChatParam: InsertChatParam,
    callback: (data: InsertChatResponse) => void
  ) => void;
}

export function connectDirectChatWebSocket({
  conversationId,
  receiverId,
}: {
  conversationId: string;
  receiverId: string;
}) {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Pass the generic types here
  const socket: DirectChatSocket = io(env.SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    query: {
      conversationId,
      receiverId,
    },
    autoConnect: true,
  });

  socket.on('connect_error', (err: SocketError) => handleWsTokenRefresh(err, socket));

  return socket;
}

// Export the typed socket
export type DirectChatSocket = SocketType<ServerToClientEvents, ClientToServerEvents>;
