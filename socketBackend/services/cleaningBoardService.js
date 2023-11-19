import { io } from "../websocket.js";

export const cleaningBoardService = (roomId) => {
  io.to(roomId).emit("whiteBoardDrawingResponse", []);
};
