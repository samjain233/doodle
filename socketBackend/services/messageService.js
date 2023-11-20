import { io } from "../server.js";


export const failToSelectWord = (roomId) => {
  //sending message of failing to choose a word by admin pc
  const modName = "Moderator";
  const chatMsg = `time over to choose a word`;
  io.to(roomId).emit("recievedChatData", { userName:modName, chatMsg });
};
