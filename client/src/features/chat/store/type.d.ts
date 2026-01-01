import type { Socket } from 'socket.io-client';

import type { CreateChatResponse } from '../schemas/create-chat/create-chat-response.schema';
import type { InsertChatParam } from '../schemas/insert-chat/insert-chat.params';
import type { InsertChatResponse } from '../schemas/insert-chat/insert-chat-response.schema';

type ServerToClientEvents = {
  chatMessage: (data: CreateChatResponse) => void;
};

// Events sent FROM the client TO the server
type ClientToServerEvents = {
  joinRoom: ({ conversationId }: { conversationId: string }) => void;
  // filepath: d:\FullStack_Placement_Projects\KnoziChat\test-nest-react-ws\client\features\chat\gateway\direct-chat.gateway.ts
  chatMessage: (
    insertChatParam: InsertChatParam,
    callback: (data: InsertChatResponse) => void
  ) => void;
};

export interface SocketStore {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinConversation: (convesationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}
