import { lobby, lobbyTime } from "../global/GlobalVariables.js";
import { timeToken } from "../utils/drawToken.js";

export const setNextTimeService = async (roomId, type, token = null) => {
  const currDate = new Date();
  const currTime = currDate.getTime();
  const currTimeRounded = currTime - (currTime % 1000);
  const tToken = await timeToken();
  let futureTime, setData;
  let lobbyData = lobby.get(roomId);
  const duration = lobbyData.settings.duration;
  switch (type) {
    case 0:
      futureTime = currTimeRounded + 7000; //7 seconds for starting game
      setData = {
        roomId: roomId,
        type: 1,
        timeToken: tToken,
      };
      break;
    case 1:
      futureTime = currTimeRounded + 20000;
      setData = {
        roomId: roomId,
        token: token,
        type: 2,
        timeToken: tToken,
      };

      break;
    case 2:
      futureTime = currTimeRounded + duration * 1000;
      setData = {
        roomId: roomId,
        type: 3,
        timeToken: tToken,
      };
      break;

    case 3:
      //10 seconds for showing scores
      futureTime = currTimeRounded + 10000;
      setData = {
        roomId: roomId,
        type: 4,
        timeToken: tToken,
      };
      break;
    case 4:
      //2 seconds after new round will be played
      futureTime = currTimeRounded + 2000;
      setData = {
        roomId: roomId,
        type: 1,
        timeToken: tToken,
      };
      break;
  }
  lobbyData.timeToken = tToken;
  lobby.set(roomId, lobbyData);
  const prevTimeData = lobbyTime.get(futureTime);
  if (prevTimeData === undefined || prevTimeData === null)
    lobbyTime.set(futureTime, [setData]);
  else lobbyTime.set(futureTime, [...prevTimeData, setData]);
};

export const checkTimeTokenService = async (roomId, token) => {
  const lobbyData = lobby.get(roomId);
  //checking if still lobbyData exists or not
  if (lobbyData === null || lobbyData === undefined) return false;

  //checking token
  if (lobbyData.timeToken === token) return true;
  else return false;
};
