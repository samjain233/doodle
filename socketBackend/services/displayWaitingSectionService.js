import { io } from "../server.js";


export const displayWaitingSectionService = (roomId) => {
  io.to(roomId).emit("waitingSection", { hideWaiting: false });
};
