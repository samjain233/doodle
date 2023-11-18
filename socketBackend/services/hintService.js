import { lobby } from "../global/GlobalVariables.js";
import { io } from "../websocket.js";

export const hintService = (roomId, userWord, socketId) => {
  const map = Array.prototype.map;

  const Indexes = map.call(userWord, (letter, index) => {
    if (letter === "*") return index;
    else return undefined;
  });
  const CandidateIndexes = Indexes.filter((element) => element !== undefined);
//   console.log(CandidateIndexes);
  const hintIndex =
    CandidateIndexes[Math.floor(Math.random() * CandidateIndexes.length)];

//   console.log(hintIndex);

  //sending new guessWord to the user SocketId
  const lobbyData = lobby.get(roomId);
  const correctWord = lobbyData.roundDetails.word;
  const newGuessWord = map.call(userWord, (letter, index) => {
    if (index === hintIndex) return correctWord[hintIndex];
    return letter;
  });

  io.to(socketId).emit("guessWord", newGuessWord);

  //incrementing hint count by 1
};
