"use client";
import React, { useRef } from "react";
import GameArea from "./components/GameArea";

const game = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  return (
    <>
      <div className="h-full w-full">
        <GameArea />
      </div>
    </>
  );
};

export default game;
