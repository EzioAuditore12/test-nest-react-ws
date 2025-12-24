import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';

export function connectWebSocket() {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) {
    throw new Error('No access token available');
  }

  const socket = io(env.SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token: accessToken, // ✅ THIS is what your WsJwtStrategy reads
    },
    autoConnect: true,
  });

  socket.on('connect_error', (err) => {
    console.log('❌ WS connect error:', err.message);
  });

  return socket;
}

interface events {
  connect: string;
  joinRoom: (username: string | undefined) => void;
  roomNotice: (username: string | undefined) => void;
  chatMessage: ({ text, sender }: { text: string; sender: string }) => void;
  typing: (username: string | undefined) => void;
}

export type Socket = SocketType<events>;
