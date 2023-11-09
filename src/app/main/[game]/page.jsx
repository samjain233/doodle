"use client";
import React, { useEffect, useRef } from "react";
import GameArea from "./components/GameArea";
import { socket } from "../../test/socketConn";
import { StateProvider } from "./States/StateManager";

const game = ({ params }) => {
  const data = {
    userName: "helloSam",
    roomId: params.game,
  };

  useEffect(() => {
    socket.emit("userJoined", data);
  }, []);

  return (
    <>
      <StateProvider>
        <GameArea roomId={params.game} />
      </StateProvider>
    </>
  );
};

export default game;
