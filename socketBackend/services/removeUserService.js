import { lobby, userLobbies } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";
import { endWordService } from "./chooseWordService.js";
import { displayCorrectWord } from "./displayGuessWord.js";
import {
  removeChatBlockService,
  removeWaitingScreenService,
} from "./resettingScoreService.js";
import { setNextTimeService } from "./setNextTimeServie.js";
import {
  decrementPresenterIndex,
  removePresenterService,
} from "./setPresenterService.js";

export const removeUserService = async (roomId, removedUserSocketId) => {
  const lobbyData = lobby.get(roomId);
  console.log(lobbyData);
  const users = lobbyData.users;
  const index = users.findIndex(
    (user) => user.socketId === removedUserSocketId
  );
  if (index !== -1) {
    users.splice(index, 1);
    lobby.set(roomId, { ...lobbyData, users });

    //deleting user from userLobbies map
    userLobbies.delete(removedUserSocketId);

    //resetting the lobby
    io.to(roomId).emit("lobby", users);

    //checking if the removedUser is the presenter or not
    if (lobbyData.presenter.socketId === removedUserSocketId) {
      console.log("presenter");
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

    //disconnection from socket
    const sockets = await io.in(roomId).fetchSockets();
    sockets.forEach((s) => {
      if (s.id === removedUserSocketId) {
        s.disconnect(true);
      }
    });
  }
};
