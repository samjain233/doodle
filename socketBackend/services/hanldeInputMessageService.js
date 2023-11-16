import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";

const MaxScore = 400;

export const handleInputMessageService = (roomId, chatMsg, socket) => {
  const lobbyData = lobby.get(roomId);
  const word = lobbyData.roundDetails.word;
  const presenterSocketId = lobbyData.presenter.socketId;
  const socketId = socket.id;
  //except presenter all participants can send messages
  if (socketId === presenterSocketId) return;

  if (chatMsg === word) {
    const moderator = "moderator";
    const msg = `${socketId} Guessed the Word`;
    io.to(roomId).emit("recievedChatData", {
      socketId: moderator,
      chatMsg: msg,
    });
    const currDate = new Date();
    const currTime = currDate.getTime();
    const startTime = lobbyData.roundDetails.startTime;
    const totalTime = lobbyData.settings.duration * 1000;
    const durationTime = currTime - startTime;
    const reverseTime = totalTime - durationTime;
    const score = Math.round((MaxScore * reverseTime) / totalTime);
    console.log(score);
    return;
  }

  io.to(roomId).emit("recievedChatData", { socketId, chatMsg });
};
