import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";
import { removeWordService } from "./lobbyServices.js";

const map = Array.prototype.map;

export const displayGuessWord = (roomId, word) => {
  const lobbyData = lobby.get(roomId);
  const presenterSocketId = lobbyData.presenter.socketId;
  const guessWordArray = map.call(word, (letter) => {
    if (letter === " ") return " ";
    else return "*";
  });
  const guessWord = guessWordArray.join("");
  io.to(roomId).except(presenterSocketId).emit("guessWord", guessWord);
  io.to(presenterSocketId).emit("guessWord", word);
};

export const displayCorrectWord = async (roomId) => {
  const lobbyData = await lobby.get(roomId);
  const correctWord = lobbyData.roundDetails.word;
  io.to(roomId).emit("guessWord", correctWord);
  removeWordService(roomId);
};
