//setting up a new presenter
import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";

export const setPresenterService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  io.to(presenterSocketId).emit("setPresenter", { presenter: true });

  //setting drawToken to null
  lobbyData.presenter.drawToken = null;
  lobby.set(roomId,lobbyData);

  //setting time in time panel
  const time = lobbyData.settings.duration;
  io.to(roomId).emit("setTime", time);

  //sending message of presenter by admin pc
  const socketId = "Moderator";
  const chatMsg = `${presenterSocketId} is the presenter`;
  io.to(roomId).emit("recievedChatData", { socketId, chatMsg });
};

export const removePresenterService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  io.to(presenterSocketId).emit("setPresenter", { presenter: false });
  lobbyData.presenter.socketId = null;
  lobbyData.presenter.drawToken = null;
  lobby.set(roomId, lobbyData);
};

export const getDrawToken = (roomId) =>{
  let lobbyData = lobby.get(roomId);
  console.log(lobbyData);
  const drawToken = lobbyData.presenter.drawToken;
  return drawToken;
}
