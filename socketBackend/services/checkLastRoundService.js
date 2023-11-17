import { lobby } from "../global/GlobalVariables.js";

export const checkLastRoundService = (roomId) => {
  const lobbyData = lobby.get(roomId);
  if (
    lobbyData.roundDetails.round === lobbyData.settings.rounds &&
    lobbyData.presenter.index === lobbyData.users.length - 1
  ) {
    console.log("game over");
    return true;
  }
  return false;
};
