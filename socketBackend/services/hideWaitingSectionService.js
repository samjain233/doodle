import { io } from "../server.js";


export const hideWaitingSectionService = (roomId) => {
  io.to(roomId).emit("waitingSection", { hideWaiting: true });
};
