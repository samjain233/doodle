import { io } from "../server.js";


export const cleaningBoardService = (roomId) => {
  io.to(roomId).emit("whiteBoardDrawingResponse", []);
};
