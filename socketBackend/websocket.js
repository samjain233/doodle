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
import { setNextTimeService } from "./services/setNextTimeServie.js";
import {
  displayScoreService,
  hideScoreService,
} from "./services/displayScoreService.js";
import { drawToken } from "./utils/drawToken.js";
import { failToSelectWord } from "./services/messageService.js";

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
      });
      lobby.set(roomId, { ...tLobbyData, users });
    } else {
      lobby.set(roomId, {
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
          duration: 10,
          hints: 3,
          visibility: "Private",
        },
        roundDetails: {
          round: 0,
        },
        users: [
          {
            socketId: socket.id,
            userId: "imported from MongoDb",
            userName: "raja",
            isAdmin: true,
            score: 0,
          },
        ],
      });
      io.to(socket.id).emit("setAdmin", { setAdmin: true });
    }
    const lobbyData = lobby.get(roomId);
    userLobbies.set(socket.id, roomId);
    console.log(lobbyData);
    io.to(roomId).emit("lobby", lobbyData.users);
    // io.to(roomId).emit("lobbySettings", lobbyData.settings);
  });

  socket.on("requestLobbySettings", (roomId) => {
    const lobbyData = lobby.get(roomId);
    socket.emit("lobbySettings", lobbyData.settings);
  });

  socket.on("changeLobbySettings", ({ roomId, gameSettings }) => {
    const lobbyData = lobby.get(roomId);
    lobbyData.settings = gameSettings;
    lobby.set(roomId, { ...lobbyData });
    socket.to(roomId).emit("lobbySettings", lobbyData.settings);
  });

  socket.on("controlStartGame", (roomId) => {
    const currDate = new Date();
    const currTime = currDate.getTime();
    const currTimeRounded = currTime - (currTime % 1000);
    //setting whiteBoard Joining time
    const futureTime = currTimeRounded + 10000;
    console.log(futureTime);
    const setData = {
      roomId: roomId,
      type: 1,
    };
    const prevTimeData = lobbyTime.get(futureTime);
    if (prevTimeData === undefined || prevTimeData === null)
      lobbyTime.set(futureTime, [setData]);
    else lobbyTime.set(futureTime, [...prevTimeData, setData]);
    const nextPageUrl = "/main/" + roomId;
    io.to(roomId).emit("StartGame", nextPageUrl);
  });

  socket.on("whiteBoardDrawing", (data) => {
    const { roomId, elements } = data;
    const lobbyData = lobby.get(roomId);
    const presenterSocketId = lobbyData.presenter.socketId;
    if (presenterSocketId === socket.id) {
      socket.to(roomId).emit("whiteBoardDrawingResponse", elements);
    }
  });

  socket.on("chatData", (data) => {
    console.log(data);
    const { roomId, socketId, chatMsg } = data;
    socket.to(roomId).emit("recievedChatData", { socketId, chatMsg });
  });

  socket.on("wordChoosed", (data) => {
    //check karo ki right presenter hai ya nahi
    //then token match karo aur token ko hatao
    const { choosedWordIndex, roomId } = data;
    const lobbyData = lobby.get(roomId);
    const presenterSocketId = lobbyData.presenter.socketId;
    if (presenterSocketId === socket.id) {
      endWordService(roomId);
      setPresenterService(roomId);
      setNextTimeService(roomId, 2);
    }
  });

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

  socket.on("removeUser", async (data) => {
    const roomId = userLobbies.get(socket.id);
    if (roomId !== undefined && roomId !== null) {
      const tlobbyData = lobby.get(roomId);
      const adminSocketId = tlobbyData.admin.socketId;
      if (adminSocketId === socket.id) {
        const users = tlobbyData.users;
        const index = users.findIndex(
          (user) => user.socketId === data.removedUserSocketId
        );
        if (index !== -1) {
          users.splice(index, 1);
          lobby.set(roomId, { ...tlobbyData, users });
          userLobbies.delete(data.removedUserSocketId);
          io.to(roomId).emit("lobby", users);
          const sockets = await io.in(roomId).fetchSockets();
          // console.log(sockets);
          sockets.forEach((s) => {
            if (s.id === data.removedUserSocketId) {
              s.disconnect(true);
            }
          });
        }
      }
    }
  });

  socket.on("disconnect", async () => {
    // console.log(io.engine.clientsCount);
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

const setPresenter = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const prevPresenterIndex = lobbyData.presenter.index;
  const newPresenterIndex = prevPresenterIndex + 1;
  const users = lobbyData.users;
  const presenterUser = users[newPresenterIndex];
  const presenterUserSocketId = presenterUser.socketId;
  lobbyData.presenter.index = newPresenterIndex;
  lobby.set(roomId, lobbyData);
  const currDate = new Date();
  const currTime = currDate.getTime();
  const currTimeRounded = currTime - (currTime % 1000);
  const futureTime = currTimeRounded + 20000;
  console.log(futureTime);
  const setData = {
    roomId: roomId,
    type: "endRound",
  };
  lobbyTime.set(futureTime, setData);
  io.to(presenterUserSocketId).emit("setPresenter", { setPresenter: true });
};

const getCurrentTime = () => {
  const currDate = new Date();
  const currTime = currDate.getTime();
  const currTimeRounded = currTime - (currTime % 1000);
  console.log(currTimeRounded);
  if (lobbyTime.has(currTimeRounded) === true) {
    const timeDataArray = lobbyTime.get(currTimeRounded);
    lobbyTime.delete(currTimeRounded);
    timeDataArray.forEach((timeData) => {
      const { roomId, type } = timeData;
      switch (type) {
        case 1:
          //waiting time overs and setting ,opening word choose time
          hideWaitingSectionService(roomId);
          drawToken().then((token) => {
            chooseWordService(roomId, token);
            setNextTimeService(roomId, 1, token);
          });
          break;
        case 2:
          //choosing word time overs , showing scores
          const dToken = getDrawToken(roomId);
          console.log(dToken);
          console.log(timeData.token);
          if (dToken === timeData.token) {
            endWordService(roomId);
            failToSelectWord(roomId);
            displayScoreService(roomId);
            removePresenterService(roomId);
            setNextTimeService(roomId, 3);
          }
          break;
        case 3:
          //drawing time overs , showing scores , removing presenter
          displayScoreService(roomId);
          removePresenterService(roomId);
          setNextTimeService(roomId, 3);
          break;
        case 4:
          //showing scores time overs , cleaning the board , jumping to case 1
          hideScoreService(roomId);
          setNextTimeService(roomId, 4);
          break;
      }
    });
    // setPresenter(lobbyTimeData.roomId);
  }
};

const oneSecondTimeInterval = setInterval(getCurrentTime, 1000);

httpServer.listen(5000, () => {
  console.log("server is listening to the port 5000");
});

//1 - white Board joining time
//2 - word choosing time - 20 seconds for choosing word
//3 - drawing time
//4 - showing scores
