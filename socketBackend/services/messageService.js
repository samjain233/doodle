import { io } from "../server.js";

export const failToSelectWord = (roomId) => {
  //sending message of failing to choose a word by admin pc
  const modName = "Moderator";
  const chatMsg = `time over to choose a word`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
};

export const userJoinedTheRoomService = (roomId, username) => {
  const modName = "Moderator";
  const chatMsg = `${username} Joined`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
};

export const adminChangeMessageService = (roomId, username) => {
  const modName = "Moderator";
  const chatMsg = `${username} is the new Admin`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
};

export const adminRemovedMemberMessageService = (roomId, username) => {
  const modName = "Moderator";
  const chatMsg = `admin removed ${username} from the lobby`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
};

export const leaveTheLobbyMessageService = (roomId , username) =>{
  const modName = "Moderator";
  const chatMsg = `${username} leaved the lobby`;
  io.to(roomId).emit("recievedChatData", { userName: modName, chatMsg });
}
