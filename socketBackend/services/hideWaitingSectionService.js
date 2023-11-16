import { io } from "../websocket.js";

export const hideWaitingSectionService = (roomId) => {
  io.to(roomId).emit("waitingSection", { hideWaiting: true });
};
