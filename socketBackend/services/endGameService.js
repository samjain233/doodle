import { lobby } from "../global/GlobalVariables.js";
import { io } from "../server.js";

export const endGameService = (roomId) => {
  //sort result
  const lobbyData = lobby.get(roomId);
  const users = lobbyData.users;
  users.sort((a, b) => {
    return b.score - a.score;
  });

  //give to the clients
  io.to(roomId).emit("lobby", users);
  io.to(roomId).emit("showResult", { result: true });

  //saving results of these clients in the database
  //disconnect all users of that lobby
};
