import { lobby, userLobbies } from "../global/GlobalVariables.js";
import { io } from "../server.js";
import { displayCorrectWord } from "./displayGuessWord.js";
import { leaveTheLobbyMessageService } from "./messageService.js";
import {
  removeChatBlockService,
  removeWaitingScreenService,
} from "./resettingScoreService.js";
import { setNextTimeService } from "./setNextTimeServie.js";
import {
  decrementPresenterIndex,
  removePresenterService,
} from "./setPresenterService.js";

export const disconnectUserService = async (roomId, socketId, socket) => {
  const lobbyData = lobby.get(roomId);
  const users = lobbyData.users;
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    const userName = users[index].userName;
    users.splice(index, 1);

    //if he is the last user to leaving the room then deleting the room
    if (users.length === 0) {
      socket.leave(roomId);
      lobby.delete(roomId);
      userLobbies.delete(socketId);
      return;
    }

    leaveTheLobbyMessageService(roomId, userName);

    //if the user is admin the change the admin
    if (socketId === lobbyData.admin.socketId && users.length > 0) {
      users[0].isAdmin = true;
      const newAdminSocketId = users[0].socketId;
      io.to(newAdminSocketId).emit("setAdmin", { setAdmin: true });
      lobbyData.admin.socketId = newAdminSocketId;
    }

    // if the user is the current presenter
    if (lobbyData.presenter.socketId === socketId) {
      //then i need some additional steps to perform
      //showing score card in the lobby
      io.to(roomId).emit("showScore", { showScoreWindow: true });
      removePresenterService(roomId);
      displayCorrectWord(roomId);
      removeChatBlockService(roomId);
      removeWaitingScreenService(roomId);

      //decrement index of presenter by 1
      decrementPresenterIndex(roomId);

      //resetting the time to null in the lobby
      io.to(roomId).emit("setTime", null);

      setNextTimeService(roomId, 3);
    }

    socket.leave(roomId);
    lobby.set(roomId, { ...lobbyData, users });
    userLobbies.delete(socketId);
    io.to(roomId).emit("lobby", users);
  }
};
