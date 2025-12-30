import { io, type Socket as SocketType } from 'socket.io-client';

import { env } from '@/env';

import { useAuthStore } from '@/store/auth';
import { refreshAccessToken } from './token-manager'; // Import the shared logic

type SocketError = Error & { data?: { status: number } };

export function connectWebSocket() {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  console.log(accessToken);

  if (!accessToken) {
    throw new Error('No access token available');
  }

  const socket = io(env.SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: true,
  });

  socket.on('connect_error', async (err: SocketError) => {
    console.log('❌ WS connect error:', err.message);

    // Check for the custom status we added on the server
    if (err.data?.status === 401) {
      // 1. STOP the auto-reconnect loop immediately
      socket.disconnect();

      console.log('🔄 Token expired. Attempting refresh...');

      try {
        // 2. Wait for the shared refresh logic to complete
        await refreshAccessToken();

        // 3. Get the new token
        const newAccessToken = useAuthStore.getState().tokens?.accessToken;

        if (newAccessToken) {
          console.log('✅ Token refreshed. Reconnecting socket...');

          // 4. Update the socket's auth object
          socket.auth = { token: newAccessToken };

          // 5. Manually reconnect
          socket.connect();
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed.', refreshError);

        useAuthStore.getState().logout();
      }
    }
  });

  return socket;
}

interface events {
  connect: string;
  joinRoom: (username: string | undefined) => void;
  roomNotice: (username: string | undefined) => void;
  chatMessage: ({ text, sender }: { text: string; sender: string }) => void;
  typing: (username: string | undefined) => void;
  'online:users': (users: string[]) => void; // Add this line
}

export type Socket = SocketType<events>;
