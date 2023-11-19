import { createServer } from "http";
import { Server } from "socket.io";
import { lobby, lobbyTime, userLobbies } from "./global/GlobalVariables.js";
import { hideWaitingSectionService } from "./services/hideWaitingSectionService.js";
import {
  getDrawToken,
  removePresenterService,
  setPresenterService,
} from "./services/setPresenterService.js";
import {
  chooseWordService,
  endWordService,
} from "./services/chooseWordService.js";
import {
  checkTimeTokenService,
  setNextTimeService,
} from "./services/setNextTimeServie.js";
import {
  displayScoreService,
  hideScoreService,
} from "./services/displayScoreService.js";
import { drawToken } from "./utils/drawToken.js";
import { failToSelectWord } from "./services/messageService.js";
import {
  displayCorrectWord,
  displayGuessWord,
  resetGuessWordDisplayService,
} from "./services/displayGuessWord.js";
import { handleInputMessageService } from "./services/hanldeInputMessageService.js";
import { setStartTimeService } from "./services/lobbyServices.js";
import {
  removeChatBlockService,
  removeWaitingScreenService,
  resettingScoreService,
} from "./services/resettingScoreService.js";
import { checkLastRoundService } from "./services/checkLastRoundService.js";
import { removeUserService } from "./services/removeUserService.js";
import {
  displayHintsToAllLobby,
  displayRemainingHintServie,
  hintService,
} from "./services/hintService.js";
import { cleaningBoardService } from "./services/cleaningBoardService.js";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { roomId } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });

  socket.on("joinLobby", (data) => {
    const { roomId } = data;
    if (lobby.has(roomId)) {
      const tLobbyData = lobby.get(roomId);
      const { users } = tLobbyData;
      users.push({
        socketId: socket.id,
        userId: "imported from MongoDb",
        userName: "Bekarraja",
        isAdmin: false,
        score: 0,
        hintsUsed: 0,
      });
      lobby.set(roomId, { ...tLobbyData, users });
    } else {
      lobby.set(roomId, {
        game: {
          isStarted: false,
        },
        admin: {
          socketId: socket.id,
        },
        presenter: {
          socketId: null,
          index: -1,
          drawToken: null,
        },
        settings: {
          players: 8,
          rounds: 3,
          duration: 90,
          hints: 10,
          visibility: "Private",
        },
        roundDetails: {
          round: 0,
          word: null,
        },
        users: [
          {
            socketId: socket.id,
            userId: "imported from MongoDb",
            userName: "raja",
            isAdmin: true,
            score: 0,
            hintsUsed: 0,
          },
        ],
      });
      io.to(socket.id).emit("setAdmin", { setAdmin: true });
    }
    const lobbyData = lobby.get(roomId);
    userLobbies.set(socket.id, roomId);
    io.to(roomId).emit("lobby", lobbyData.users);
    displayRemainingHintServie(roomId, socket.id);
    // io.to(roomId).emit("lobbySettings", lobbyData.settings);
  });

  socket.on("requestLobbySettings", (roomId) => {
    const lobbyData = lobby.get(roomId);
    socket.emit("lobbySettings", lobbyData.settings);
  });

  socket.on("changeLobbySettings", ({ roomId, gameSettings }) => {
    const lobbyData = lobby.get(roomId);
    if (
      lobbyData.admin.socketId === socket.id &&
      lobbyData.game.isStarted === false
    ) {
      lobbyData.settings = gameSettings;
      socket.to(roomId).emit("lobbySettings", lobbyData.settings);
      displayHintsToAllLobby(roomId);
    }
  });

  //controls start of gameplay
  socket.on("controlStartGame", (roomId) => {
    const lobbyData = lobby.get(roomId);
    //checking of admin socketId
    if (socket.id === lobbyData.admin.socketId) {
      displayHintsToAllLobby(roomId);
      setNextTimeService(roomId, 0);
      const nextPageUrl = "/main/" + roomId;
      io.to(roomId).emit("StartGame", nextPageUrl);
      //chaging game isStarted to true;
      lobbyData.game.isStarted = true;
      lobby.set(roomId, lobbyData);
    }
  });

  socket.on("whiteBoardDrawing", (data) => {
    const { roomId, elements } = data;
    const lobbyData = lobby.get(roomId);
    const presenterSocketId = lobbyData.presenter.socketId;
    if (presenterSocketId === socket.id) {
      socket.to(roomId).emit("whiteBoardDrawingResponse", elements);
    }
  });

  socket.on("sendMessage", (data) => {
    const { roomId, chatMsg } = data;
    handleInputMessageService(roomId, chatMsg, socket);
  });

  socket.on("wordChoosed", (data) => {
    //check karo ki right presenter hai ya nahi
    //then token match karo aur token ko hatao
    const { word, roomId } = data;
    let lobbyData = lobby.get(roomId);
    const presenterSocketId = lobbyData.presenter.socketId;
    if (presenterSocketId === socket.id) {
      endWordService(roomId);
      setStartTimeService(roomId);
      removeWaitingScreenService(roomId);
      displayGuessWord(roomId, word);
      setPresenterService(roomId);
      setNextTimeService(roomId, 2);
      //setting a new word in the lobby
      lobbyData.roundDetails.word = word;
      lobby.set(roomId, lobbyData);
    }
  });

  // hints controller
  socket.on("useHint", ({ roomId, userWord }) => {
    const socketId = socket.id;
    hintService(roomId, userWord, socketId);
  });

  //only for admin
  socket.on("changeAdmin", (data) => {
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const adminSocketId = tlobbyData.admin.socketId;
      if (adminSocketId === socket.id) {
        const users = tlobbyData.users;
        const index = users.findIndex(
          (user) => user.socketId === data.newAdminSocketId
        );
        if (index !== -1) {
          users[index].isAdmin = true;
          const preAdminIndex = users.findIndex(
            (user) => user.socketId === socket.id
          );
          users[preAdminIndex].isAdmin = false;
          io.to(data.newAdminSocketId).emit("setAdmin", { setAdmin: true });
          io.to(socket.id).emit("setAdmin", { setAdmin: false });
          tlobbyData.admin.socketId = data.newAdminSocketId;
          lobby.set(roomId, { ...tlobbyData, users });
          io.to(roomId).emit("lobby", users);
        }
      }
    }
  });

  //only for admin
  socket.on("removeUser", async (data) => {
    const { roomId, removedUserSocketId } = data;
    const tlobbyData = lobby.get(roomId);
    const adminSocketId = tlobbyData.admin.socketId;
    //checking amdin Credentials
    if (adminSocketId === socket.id) {
      removeUserService(roomId, removedUserSocketId);
    }
  });

  socket.on("disconnect", async () => {
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const users = tlobbyData.users;
      const index = users.findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        users.splice(index, 1);

        if (socket.id === tlobbyData.admin.socketId && users.length > 0) {
          users[0].isAdmin = true;
          const newAdminSocketId = users[0].socketId;
          io.to(newAdminSocketId).emit("setAdmin", { setAdmin: true });
          tlobbyData.admin.socketId = newAdminSocketId;
        }
        socket.leave(roomId);
        lobby.set(roomId, { ...tlobbyData, users });
        const lobbyData = lobby.get(roomId);
        userLobbies.delete(socket.id);
        if (lobbyData.users.length === 0) lobby.delete(roomId);
        io.to(roomId).emit("lobby", lobbyData.users);
      }
    }
  });
});

const getCurrentTime = () => {
  const currDate = new Date();
  const currTime = currDate.getTime();
  const currTimeRounded = currTime - (currTime % 1000);
  const timeArray = [currTimeRounded, currTimeRounded - 1000];
  timeArray.forEach((time) => {
    if (lobbyTime.has(time) === true) {
      const timeDataArray = lobbyTime.get(time);
      lobbyTime.delete(time);
      timeDataArray.forEach((timeData) => {
        const { roomId, type, timeToken } = timeData;
        checkTimeTokenService(roomId, timeToken).then((res) => {
          //exiting if time token expires
          if (res === false) return;
          switch (type) {
            case 1:
              //waiting time overs and setting ,sending presenter details to lobby ,opening word choose time
              hideWaitingSectionService(roomId);
              drawToken().then((token) => {
                chooseWordService(roomId, token);
                setNextTimeService(roomId, 1, token);
              });
              break;
            case 2:
              //choosing word time overs , showing scores
              const dToken = getDrawToken(roomId);
              if (dToken === timeData.token) {
                endWordService(roomId);
                failToSelectWord(roomId);
                removeWaitingScreenService(roomId);
                displayScoreService(roomId);
                removePresenterService(roomId);
                setNextTimeService(roomId, 3);
              }
              break;
            case 3:
              //drawing time overs , showing scores ,showing correct answer, removing chat block, unsetting of word, removing presenter
              displayScoreService(roomId);
              removePresenterService(roomId);
              displayCorrectWord(roomId); //removing word service called from this
              removeChatBlockService(roomId);
              setNextTimeService(roomId, 3);
              break;
            case 4:
              //showing scores time overs ,removing the word , cleaning the board , setting thisRoundScore to 0, jumping to case 1
              resettingScoreService(roomId);
              resetGuessWordDisplayService(roomId);
              hideScoreService(roomId);
              cleaningBoardService(roomId);
              const isLastRound = checkLastRoundService(roomId);
              if (!isLastRound) setNextTimeService(roomId, 4);
              break;
          }
        });
      });
    }
  });
};

const oneSecondTimeInterval = setInterval(getCurrentTime, 1000);

httpServer.listen(5000, () => {
  console.log("server is listening to the port 5000");
});

//1 - white Board joining time
//2 - word choosing time - 20 seconds for choosing word
//3 - drawing time
//4 - showing scores
