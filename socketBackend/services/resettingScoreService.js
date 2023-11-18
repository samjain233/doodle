import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";

export const resettingScoreService = (roomId) => {
  const lobbyData = lobby.get(roomId);
  const users = lobbyData.users;
  const setNewUsers = users.map((user) => {
    user.thisRoundScore = 0;
    return user;
  });
  lobby.set(roomId, { ...lobbyData, users: setNewUsers });

  //setting round scores to 0
  io.to(roomId).emit("lobby", setNewUsers);
};

export const removeChatBlockService = (roomId) => {
  io.to(roomId).emit("chatBlock", { chatBlock: false });
};

export const removeWaitingScreenService = (roomId) => {
  io.to(roomId).emit("waitingSection", { hideWaiting: true });
};
