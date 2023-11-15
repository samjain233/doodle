import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import { socket } from "@/app/test/socketConn";

const Score = ({ roomId }) => {
  const [lobby, setLobby] = useState([]);
  useEffect(() => {
    socket.on("userScores", (lobbyUsers) => {
      setLobby(lobbyUsers);
    });
  }, []);
  return (
    <>
      <div className="w-full h-full bg-gray-200/20 backdrop-blur-md">
        <div className="w-full h-full grid grid-cols-5 gap-4 gap-y-12 overflow-y-auto">
          {lobby.map((element) => {
            return (
              <div key={element.socketId}>
                <Profile {...element} roomId={roomId} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Score;
