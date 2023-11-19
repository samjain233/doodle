//selecting a new presenter and opening and closing choosing window code
import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";
import { setFourWordsService } from "./setFourWordsService.js";

export const chooseWordService = (roomId, token) => {
  let lobbyData = lobby.get(roomId);
  const currentPresenterIndex = lobbyData.presenter.index;
  const totalUsers = lobbyData.users.length;
  const nextPresenterIndex = (currentPresenterIndex + 1) % totalUsers;

  const users = lobbyData.users;
  const presenterDetails = users[nextPresenterIndex];
  const presenterSocketId = presenterDetails.socketId;
  lobbyData.presenter.index = nextPresenterIndex;
  lobbyData.presenter.socketId = presenterSocketId;
  lobbyData.presenter.drawToken = token;
  if (nextPresenterIndex == 0) lobbyData.roundDetails.round += 1;
  lobby.set(roomId, lobbyData);
  io.to(presenterSocketId).emit("chooseWord", { chooseWordWindow: true });

  //send presenter details in the lobby
  io.to(roomId).emit("presenterDetails", { presenterSocketId });

  //showing waiting screen to the rest lobby
  io.to(roomId)
    .except(presenterSocketId)
    .emit("waitingSection", { hideWaiting: false });

  //sending word list to the presenter
  setFourWordsService(presenterSocketId);

  //setting time in time panel
  const time = 20;
  io.to(roomId).emit("setTime", time);

  //sending roundNo.
  const roundNo = lobbyData.roundDetails.round;
  io.to(roomId).emit("roundNo", roundNo);

  //sending message of presenter by admin pc
  const socketId = "Moderator";
  const chatMsg = `${presenterSocketId} is choosing a word`;
  io.to(roomId).emit("recievedChatData", { socketId, chatMsg });
};

export const endWordService = (roomId) => {
  const lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  io.to(presenterSocketId).emit("chooseWord", { chooseWordWindow: false });
};
