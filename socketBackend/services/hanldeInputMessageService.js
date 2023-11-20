import { lobby } from "../global/GlobalVariables.js";
import { io } from "../server.js";
import { displayCorrectWord } from "./displayGuessWord.js";
import { displayScoreService } from "./displayScoreService.js";
import { removeChatBlockService } from "./resettingScoreService.js";
import { setNextTimeService } from "./setNextTimeServie.js";
import { removePresenterService } from "./setPresenterService.js";

const MaxScore = 400;

export const handleInputMessageService = (
  roomId,
  chatMsg,
  userName,
  socket
) => {
  const lobbyData = lobby.get(roomId);
  const word = lobbyData.roundDetails.word;
  const presenterSocketId = lobbyData.presenter.socketId;
  const socketId = socket.id;
  //except presenter all participants can send messages
  if (socketId === presenterSocketId) return;
  if (chatMsg === "" || chatMsg === null || chatMsg === undefined) return;

  if (
    typeof word === "string" &&
    chatMsg.toLowerCase() === word.toLowerCase()
  ) {
    let users = lobbyData.users;
    const presenterSocketId = lobbyData.presenter.socketId;
    const index = users.findIndex((user) => user.socketId === socketId);

    //sending message in the lobby
    const moderator = "moderator";
    const msg = `${users[index].userName} Guessed the Word`;
    io.to(roomId).emit("recievedChatData", {
      userName: moderator,
      chatMsg: msg,
    });

    //calculting score
    const currDate = new Date();
    const currTime = currDate.getTime();
    const startTime = lobbyData.roundDetails.startTime;
    const totalTime = lobbyData.settings.duration * 1000;
    const durationTime = currTime - startTime;
    const reverseTime = totalTime - durationTime;
    const score = Math.round((MaxScore * reverseTime) / totalTime);

    //applying chat block
    io.to(socketId).emit("chatBlock", { chatBlock: true });

    //setting score value in the lobbyData
    const pIndex = users.findIndex(
      (user) => user.socketId === presenterSocketId
    );
    if (
      index !== -1 &&
      index < users.length &&
      pIndex !== -1 &&
      pIndex < users.length
    ) {
      users[index].score += score;
      users[index].thisRoundScore = score;
      const pScore = Math.round(score / (users.length - 1));
      users[pIndex].score += pScore;
      if (users[pIndex].thisRoundScore === undefined)
        users[pIndex].thisRoundScore = pScore;
      else users[pIndex].thisRoundScore += pScore;
      lobby.set(roomId, { ...lobbyData, users });
    }
    io.to(roomId).emit("lobby", users);

    //checking if all the users has guessed the word
    let noOfUsershasGuessedTheWord = 0;
    users.forEach((user) => {
      console.log(user.thisRoundScore);
      if (
        user.thisRoundScore !== null &&
        user.thisRoundScore !== undefined &&
        user.thisRoundScore > 0
      ) {
        noOfUsershasGuessedTheWord += 1;
      }
    });
    if (noOfUsershasGuessedTheWord === users.length) {
      displayScoreService(roomId);
      removePresenterService(roomId);
      displayCorrectWord(roomId);
      removeChatBlockService(roomId);

      //resetting the time to null in the lobby
      io.to(roomId).emit("setTime", 0);

      setNextTimeService(roomId, 3);
    }

    return;
  }

  io.to(roomId).emit("recievedChatData", { userName, chatMsg });
};
