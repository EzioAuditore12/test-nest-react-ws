import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { handleWsTokenRefresh, type SocketError } from './ws-token-refresh';
import { type CreateChatResponse } from '../schemas/create-chat/create-chat-response.schema';

// Events sent FROM the server TO the client
interface ServerToClientEvents {
  chatMessage: (data: CreateChatResponse) => void;
}

// Events sent FROM the client TO the server
interface ClientToServerEvents {
  joinRoom: () => void;
  // Update this line to include the callback
  chatMessage: (text: string, callback: (data: CreateChatResponse) => void) => void;
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
