import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";

export const displayScoreService = (roomId) => {
  const roomdata = lobby.get(roomId);
  const users = roomdata.users;
  io.to(roomId).emit("lobby", users);

  //display scores
  io.to(roomId).emit("showScore", { showScoreWindow: true });
};

export const hideScoreService = (roomId) => {
  io.to(roomId).emit("showScore", { showScoreWindow: false });
};
