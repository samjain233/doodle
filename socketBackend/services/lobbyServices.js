import { lobby } from "../global/GlobalVariables.js";

export const removeWordService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  lobbyData.roundDetails.word = null;
  lobby.set(lobbyData);
};

export const setStartTimeService = (roomId) => {
  let lobbyData = lobby.get(roomId);
  const currDate = new Date();
  const currTime = currDate.getTime();
  lobbyData.roundDetails.startTime = currTime;
  lobby.set(roomId, lobbyData);
};
