import { Server } from "socket.io";

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

    socket.on("online", (data) => {
      console.log('online', data)
      users[socket.id] = data.userId;
      socket.broadcast.emit("user-online", data.userId);
    });

    socket.on('disconnect', function(){
      socket.broadcast.emit("user-offline", users[socket.id]);
      delete users[socket.id];
    });
  });
};