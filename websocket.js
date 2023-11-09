import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("userJoined", (data) => {
    const { roomId } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });

  socket.on("whiteBoardDrawing", (data) => {
    const { roomId, elements } = data;
    console.log(roomId, elements);
    socket.to(roomId).emit("whiteBoardDrawingResponse", elements);
  });
});

httpServer.listen(5000, () => {
  console.log("server is listening to the port 5000");
});
