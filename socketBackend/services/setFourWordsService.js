import { dataArray } from "../utils/shuffleArray.js";
import { io } from "../websocket.js";

export const setFourWordsService = (presenterSocketId) => {
  const index = Math.floor(Math.random() * dataArray.length);
  let words = [];
  for (let i = 0; i < 4; i++) {
    words.push(dataArray[(index + i) % dataArray.length]);
  }
  io.to(presenterSocketId).emit("selectFromFourWords", { words: words });
};
