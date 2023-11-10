"use client";
import React, { useEffect, useRef } from "react";
import GameArea from "./components/GameArea";

import { StateProvider } from "./States/StateManager";

const game = ({ params }) => {
  
  return (
    <>
      <StateProvider>
        <GameArea roomId={params.game} />
      </StateProvider>
    </>
  );
};

export default game;
