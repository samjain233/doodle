import { lobby, lobbyTime } from "../global/GlobalVariables.js";

export const setNextTimeService = (roomId, type, token = null) => {
  const currDate = new Date();
  const currTime = currDate.getTime();
  const currTimeRounded = currTime - (currTime % 1000);
  let futureTime, setData;
  switch (type) {
    case 1:
      futureTime = currTimeRounded + 20000;
      setData = {
        roomId: roomId,
        token: token,
        type: 2,
      };

      break;
    case 2:
      const lobbyData = lobby.get(roomId);
      const duration = lobbyData.settings.duration;
      futureTime = currTimeRounded + duration * 1000;
      setData = {
        roomId: roomId,
        type: 3,
      };
      break;

    case 3:
      //10 seconds for showing scores
      futureTime = currTimeRounded + 10000;
      setData = {
        roomId: roomId,
        type: 4,
      };
      break;
    case 4:
      //2 seconds after new round will be played
      futureTime = currTimeRounded + 2000;
      setData = {
        roomId: roomId,
        type: 1,
      };
      break;
  }
  const prevTimeData = lobbyTime.get(futureTime);
  if (prevTimeData === undefined || prevTimeData === null)
    lobbyTime.set(futureTime, [setData]);
  else lobbyTime.set(futureTime, [...prevTimeData, setData]);
};
