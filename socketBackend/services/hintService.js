import { lobby } from "../global/GlobalVariables.js";
import { io } from "../server.js";

export const hintService = async (roomId, userWord, socketId) => {
  const map = Array.prototype.map;

  //checking for available hints
  const lobbyData = lobby.get(roomId);
  const users = lobbyData.users;
  const totalHints = lobbyData.settings.hints;
  const index = users.findIndex((user) => user.socketId === socketId);
  if (totalHints === users[index].hintsUsed) {
    console.log("hinst finished");
    return;
  }

  const Indexes = map.call(userWord, (letter, index) => {
    if (letter === "*") return index;
    else return undefined;
  });
  const CandidateIndexes = Indexes.filter((element) => element !== undefined);
  const hintIndex =
    CandidateIndexes[Math.floor(Math.random() * CandidateIndexes.length)];

  //sending new guessWord to the user SocketId
  const correctWord = lobbyData.roundDetails.word;
  const newGuessWord = map.call(userWord, (letter, index) => {
    if (index === hintIndex) return correctWord[hintIndex];
    return letter;
  });

  io.to(socketId).emit("guessWord", newGuessWord);

  //incrementing hint count by 1
  users[index].hintsUsed = users[index].hintsUsed + 1;
  lobby.set(roomId, { ...lobbyData, users });

  //displaying remainig hints
  displayRemainingHintServie(roomId, socketId);
};

export const displayRemainingHintServie = (roomId, socketId) => {
  const lobbyData = lobby.get(roomId);
  console.log(lobbyData);
  const users = lobbyData.users;
  const totalHints = lobbyData.settings.hints;
  const index = users.findIndex((user) => user.socketId === socketId);
  const hintsUsed = users[index].hintsUsed ? users[index].hintsUsed : 0;
  const remainingHints = totalHints - hintsUsed;

  console.log(totalHints, hintsUsed, remainingHints);

  io.to(socketId).emit("remainingHints", remainingHints);
};

export const displayHintsToAllLobby = (roomId) => {
  const lobbyData = lobby.get(roomId);
  const totalHints = lobbyData.settings.hints;
  console.log("totalHints", totalHints);
  io.to(roomId).emit("remainingHints", totalHints);
};
