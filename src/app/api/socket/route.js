import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    res.status(200).json({
      success: true,
      message: "Socket is already running",
      socket: `:${5000}`,
    });
    return;
  }

  console.log("Starting Socket.IO server on port:", 5000);

  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  }).listen(5000);

  io.on("connect", (socket) => {
    const _socket = socket;
    console.log("socket connect", socket.id);
    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`);
    socket.on("disconnect", async () => {
      console.log("socket disconnect");
    });
  });

  res.socket.server.io = io;
  res.status(201).json({
    success: true,
    message: "Socket is started",
    socket: `:${5000}`,
  });
}
