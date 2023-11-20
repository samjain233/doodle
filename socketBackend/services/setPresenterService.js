//setting up a new presenter
import { lobby } from "../global/GlobalVariables.js";
import { io } from "../server.js";

export const setPresenterService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  io.to(presenterSocketId).emit("setPresenter", { presenter: true });

  //setting drawToken to null
  lobbyData.presenter.drawToken = null;
  lobby.set(roomId, lobbyData);

  //setting time in time panel
  const time = lobbyData.settings.duration;
  io.to(roomId).emit("setTime", time);

  //getting name of the presenter
  const users = lobbyData.users;
  const index = users.findIndex((user) => user.socketId === presenterSocketId);
  const presenterName = users[index].userName;

  //sending message of presenter by admin pc
  const modName = "Moderator";
  const chatMsg = `${presenterName} is the presenter`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
};

export const removePresenterService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  io.to(presenterSocketId).emit("setPresenter", { presenter: false });
  lobbyData.presenter.socketId = null;
  lobbyData.presenter.drawToken = null;
  lobby.set(roomId, lobbyData);
};

export const getDrawToken = (roomId) => {
  let lobbyData = lobby.get(roomId);
  console.log(lobbyData);
  const drawToken = lobbyData.presenter.drawToken;
  return drawToken;
};

export const decrementPresenterIndex = (roomId) => {
  const lobbyData = lobby.get(roomId);
  lobbyData.presenter.index = lobbyData.presenter.index - 1;
};
