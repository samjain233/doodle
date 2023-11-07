import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(socket.id);
  socket.on("userJoined", (data) => {
    const { roomId } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });
});

httpServer.listen(5000, () => {
  console.log("server is listening to the port 5000");
});
