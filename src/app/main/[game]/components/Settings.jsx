import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";
import React, { useContext, useEffect } from "react";
import { AiOutlineDownCircle } from "react-icons/ai";
import { AiOutlineUpCircle } from "react-icons/ai";
import { AiOutlineLeftCircle } from "react-icons/ai";
import { AiOutlineRightCircle } from "react-icons/ai";

const Settings = ({ roomId }) => {
  const { gameSettings, setGameSettings, isAdmin, gameStarted } =
    useContext(globalStateContext);
  useEffect(() => {
    console.log(roomId);
    socket.emit("requestLobbySettings", roomId);
    socket.on("lobbySettings", (lobbySettings) => {
      setGameSettings(lobbySettings);
    });
  }, []);

  useEffect(() => {
    console.log(gameStarted);
    if (isAdmin === true && gameStarted === false) {
      console.log(gameSettings);
      const data = {
        roomId: roomId,
        gameSettings: gameSettings,
      };
      socket.emit("changeLobbySettings", data);
    }
  }, [gameSettings]);

  return (
    <>
      <div className="w-full h-full overflow-y-auto py-1 [&>*:nth-child(odd)]:bg-gray-200 text-black">
        <div className="rounded my-1 flex flex-row p-3 justify-between items-center">
          <div>Players</div>
          <div className="h-full flex flex-row justify-center items-center">
            <div className="mx-4">{gameSettings.players}</div>
            {isAdmin && !gameStarted && (
              <div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.players === 12) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          players: prevSettings.players + 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineUpCircle />
                </div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.players === 2) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          players: prevSettings.players - 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineDownCircle />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded my-1 flex flex-row p-3 justify-between items-center">
          <div>Rounds</div>
          <div className="h-full flex flex-row justify-center items-center">
            <div className="mx-4">{gameSettings.rounds}</div>
            {isAdmin && !gameStarted && (
              <div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.rounds === 7) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          rounds: prevSettings.rounds + 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineUpCircle />
                </div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.rounds === 1) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          rounds: prevSettings.rounds - 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineDownCircle />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded my-1 flex flex-row p-3 justify-between items-center">
          <div>Drawing duration</div>
          <div className="h-full flex flex-row justify-center items-center">
            <div className="mx-4">{gameSettings.duration}s</div>
            {isAdmin && !gameStarted && (
              <div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.duration === 180) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          duration: prevSettings.duration + 5,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineUpCircle />
                </div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.duration === 30) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          duration: prevSettings.duration - 5,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineDownCircle />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded my-1 flex flex-row p-3 justify-between items-center">
          <div>Hints</div>
          <div className="h-full flex flex-row justify-center items-center">
            <div className="mx-4">{gameSettings.hints}</div>
            {isAdmin && !gameStarted && (
              <div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.hints === 50) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          hints: prevSettings.hints + 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineUpCircle />
                </div>
                <div
                  className="mr-1 text-xl cursor-pointer"
                  onClick={() => {
                    setGameSettings((prevSettings) => {
                      if (prevSettings.hints === 0) return prevSettings;
                      else {
                        return {
                          ...prevSettings,
                          hints: prevSettings.hints - 1,
                        };
                      }
                    });
                  }}
                >
                  <AiOutlineDownCircle />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded my-1 flex flex-row p-3 justify-between items-center">
          <div>Room Visibility</div>
          <div className="h-full flex flex-row justify-center items-center">
            {isAdmin && !gameStarted && (
              <div
                className="text-xl cursor-pointer"
                onClick={() => {
                  setGameSettings((prevSettings) => {
                    return {
                      ...prevSettings,
                      visibility:
                        prevSettings.visibility === "Private"
                          ? "Public"
                          : "Private",
                    };
                  });
                }}
              >
                <AiOutlineLeftCircle />
              </div>
            )}
            <div className="mx-1">{gameSettings.visibility}</div>
            {isAdmin && !gameStarted && (
              <div
                className="text-xl cursor-pointer"
                onClick={() => {
                  setGameSettings((prevSettings) => {
                    return {
                      ...prevSettings,
                      visibility:
                        prevSettings.visibility === "Private"
                          ? "Public"
                          : "Private",
                    };
                  });
                }}
              >
                <AiOutlineRightCircle />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
