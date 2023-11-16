import { io } from "../websocket";

export const displayWaitingSectionService = (roomId) => {
  io.to(roomId).emit("waitingSection", { hideWaiting: false });
};
