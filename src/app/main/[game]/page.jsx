"use client";
import React, { useEffect, useRef } from "react";
import GameArea from "./components/GameArea";
import { socket } from "../../test/socketConn";

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
      <div className="h-full w-full">
        <GameArea roomId={params.game} />
      </div>
    </>
  );
};

export default game;
