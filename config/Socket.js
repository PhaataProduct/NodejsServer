import { Server } from "socket.io";
import { getIdRoom, sendMessage, updateStatusUser } from "../utils/index.js";

const users = {};

export const ConnectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://6501cc7e10f85c0986f66a74--shiny-klepon-f022e3.netlify.app",
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
      sendMessage(data).then(res => {
        io.to(idRoom).emit(
          "message",
          res.data.message
        );
      });
    });

  });
};

// NOTE
// Id room always is numnber
