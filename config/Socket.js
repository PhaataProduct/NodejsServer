import { Server } from "socket.io";
import { getIdRoom, sendMessage, updateStatusUser } from "../utils/index.js";

const users = {};

export const ConnectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:8080",
        "https://phaata.info",
        "https://user.phaata.info",
        "https://phaata.com",
        "https://user.phaata.com",
      ],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('join-room', (userId) => {
      console.log(`${userId} join room`)
      socket.join(+userId);
    });

    socket.on("online", (data) => {
      users[socket.id] = data.userId;
      updateStatusUser(data.userId, 'Y');
      socket.broadcast.emit("user-online", data.userId);
    });

    socket.on('disconnect', function(){
      updateStatusUser(users[socket.id], 'N');
      socket.broadcast.emit("user-offline", users[socket.id]);
      delete users[socket.id];
    });

    // Chat
    socket.on("join_all_conversation", (data) => {
      const { arrUserId, currentUserId } = data;
      arrUserId.forEach(userId => {
        const idRoom = getIdRoom(userId, currentUserId);
        socket.join(idRoom);
      });
    });

    socket.on("message", (data) => {
      const fromId = data.from.id;
      const toId = data.to.id;
      const idRoom = getIdRoom(fromId, toId);

      // For type message is file (image & file)
      if (data.messageFile) {
        io.to(idRoom).emit(
          "message",
          data.messageFile
        );
        return;
      }
      sendMessage(data).then(res => {
        io.to(idRoom).emit(
          "message",
          { ...res.data.message, is_latest: 1 }
        );
      });
    });

    socket.on("seen_message", async (data) => {
      const fromId = data.from.id;
      const toId = data.to.id;
      const idRoom = getIdRoom(fromId, toId);
      io.to(idRoom).emit("seen_message", data);
    });

    socket.on("open_chat", async (data) => {
      // const data = {
      //   fromId: userId,
      //   toId: 1997,
      //   friendType: 1,
      // }
      const { fromId } = data;
      io.to(+fromId).emit("open_chat", data);
    });

  });
};

// NOTE
// Id room always is numnber
