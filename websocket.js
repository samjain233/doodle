import { createServer } from "http";
import { Server } from "socket.io";

const lobby = new Map();
const userLobbies = new Map();

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { roomId } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });

  socket.on("joinLobby", (data) => {
    const { roomId } = data;
    if (lobby.has(roomId)) {
      const tLobbyData = lobby.get(roomId);
      const { users } = tLobbyData;
      users.push({
        socketId: socket.id,
        userId: "imported from MongoDb",
        userName: "Bekarraja",
        isAdmin: false,
      });
      lobby.set(roomId, { ...tLobbyData, users });
    } else {
      lobby.set(roomId, {
        admin: {
          socketId: socket.id,
        },
        preseter: {
          socketId: null,
          userId: null,
        },
        users: [
          {
            socketId: socket.id,
            userId: "imported from MongoDb",
            userName: "raja",
            isAdmin: true,
          },
        ],
      });
      io.to(socket.id).emit("setAdmin", { setAdmin: true });
    }
    const lobbyData = lobby.get(roomId);
    userLobbies.set(socket.id, roomId);
    console.log(lobbyData);
    io.to(roomId).emit("lobby", lobbyData.users);
  });

  socket.on("whiteBoardDrawing", (data) => {
    const { roomId, elements } = data;
    // console.log(roomId, elements);
    socket.to(roomId).emit("whiteBoardDrawingResponse", elements);
  });

  socket.on("chatData", (data) => {
    console.log(data);
    const { roomId, socketId, chatMsg } = data;
    socket.to(roomId).emit("recievedChatData", { socketId, chatMsg });
  });

  socket.on("changeAdmin", (data) => {
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const adminSocketId = tlobbyData.admin.socketId;
      if (adminSocketId === socket.id) {
        const users = tlobbyData.users;
        const index = users.findIndex(
          (user) => user.socketId === data.newAdminSocketId
        );
        if (index !== -1) {
          users[index].isAdmin = true;
          const preAdminIndex = users.findIndex(
            (user) => user.socketId === socket.id
          );
          users[preAdminIndex].isAdmin = false;
          io.to(data.newAdminSocketId).emit("setAdmin", { setAdmin: true });
          io.to(socket.id).emit("setAdmin", { setAdmin: false });
          tlobbyData.admin.socketId = data.newAdminSocketId;
          lobby.set(roomId, { ...tlobbyData, users });
          io.to(roomId).emit("lobby", users);
        }
      }
    }
  });

  socket.on("removeUser", async (data) => {
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const adminSocketId = tlobbyData.admin.socketId;
      if (adminSocketId === socket.id) {
        const users = tlobbyData.users;
        const index = users.findIndex(
          (user) => user.socketId === data.removedUserSocketId
        );
        if (index !== -1) {
          users.splice(index, 1);
          lobby.set(roomId, { ...tlobbyData, users });
          userLobbies.delete(data.removedUserSocketId);
          io.to(roomId).emit("lobby", users);
          const sockets = await io.in(roomId).fetchSockets();
          // console.log(sockets);
          sockets.forEach((s) => {
            if (s.id === data.removedUserSocketId) {
              s.disconnect(true);
            }
          });
        }
      }
    }
  });

  socket.on("disconnect", async () => {
    // console.log(io.engine.clientsCount);
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const users = tlobbyData.users;
      const index = users.findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        users.splice(index, 1);

        if (socket.id === tlobbyData.admin.socketId && users.length > 0) {
          users[0].isAdmin = true;
          const newAdminSocketId = users[0].socketId;
          io.to(newAdminSocketId).emit("setAdmin", { setAdmin: true });
          tlobbyData.admin.socketId = newAdminSocketId;
        }

        lobby.set(roomId, { ...tlobbyData, users });
        const lobbyData = lobby.get(roomId);
        userLobbies.delete(socket.id);
        if (lobbyData.users.length === 0) lobby.delete(roomId);
        io.to(roomId).emit("lobby", lobbyData.users);
      }
    }
  });
});

httpServer.listen(5000, () => {
  console.log("server is listening to the port 5000");
});
