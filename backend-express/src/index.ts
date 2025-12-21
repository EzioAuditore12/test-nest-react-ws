import { createServer } from "node:http";
import { Server, Socket } from "socket.io";

import env from "./env";
import app from "./app";

interface ServerToClientEvents {
  welcome: (message: string) => void;
  roomNotice: (username: string) => void;
  chatMessage: (data: { text: string; sender: string }) => void;
}

interface ClientToServerEvents {
  joinRoom: (username: string) => void;
  // Change this to accept an object
  chatMessage: (data: { text: string; sender: string }) => void;
}

const server = createServer(app);

const ROOM_NAME = "GROUP";

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("A user connected", socket.id);

    socket.on("joinRoom", async (username) => {
      console.log(`${username} is joining the room`);

      await socket.join(ROOM_NAME);

      // send to all
      //io.to(ROOM_NAME).emit("roomNotice", username);

      // broadcast
      socket.to(ROOM_NAME).emit("roomNotice", username);
    });

    socket.on("chatMessage", (data) => {
      console.log(data);
      // Broadcast the full data object (text + sender)
      socket.to(ROOM_NAME).emit("chatMessage", data);
    });
  }
);

server.listen(env.PORT, () => {
  console.log(`server running at http://localhost:${env.PORT}`);
});
