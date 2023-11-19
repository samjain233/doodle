import { lobby } from "../global/GlobalVariables.js";
import { io } from "../server.js";
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
  console.log(lobbyData);
  const correctWord = lobbyData.roundDetails.word;
  console.log(correctWord);
  io.to(roomId).emit("guessWord", correctWord);
  removeWordService(roomId);
};

export const resetGuessWordDisplayService = (roomId) => {
  io.to(roomId).emit("guessWord", "");
};
