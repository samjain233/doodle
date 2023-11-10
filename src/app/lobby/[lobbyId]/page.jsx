"use client";
import React, { useEffect, useContext } from "react";
import UsersInLobby from "./components/UsersInLobby";
import { socket } from "../../test/socketConn";
import { LobbyStateProvider } from "./States/lobbyStateManager";

const page = ({ params }) => {
//   useEffect(() => {}, []);

  return (
    <>
      <LobbyStateProvider>
        <UsersInLobby roomId={params.lobbyId} />
      </LobbyStateProvider>
    </>
  );
};

export default page;
