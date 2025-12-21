import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

export function connectWebSocket() {
  return io(env.SOCKET_URL);
}

interface events {
  connect: string;
  joinRoom: (username: string | undefined) => void;
  roomNotice: (username: string | undefined) => void;
  chatMessage: ({ text, sender }: { text: string; sender: string }) => void;
}

export type Socket = SocketType<events>;
