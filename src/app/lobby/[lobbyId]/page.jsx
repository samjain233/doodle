"use client";
import React, { useEffect, useContext } from "react";
import UsersInLobby from "./components/UsersInLobby";
import { socket } from "../../test/socketConn";
import { LobbyStateProvider } from "./States/lobbyStateManager";
import ChatArea from "@/app/main/[game]/components/ChatArea";
import SideNav from "@/app/main/[game]/components/SideNav";

const page = ({ params }) => {
  //   useEffect(() => {}, []);

  return (
    <>
      <LobbyStateProvider>
        <div className="h-screen w-screen">
          <div className="w-full h-full grid grid-cols-12">
            <div className="col-span-9 bg-white overflow-x-auto">
              <UsersInLobby roomId={params.lobbyId} />
            </div>
            <div className="col-span-3">
                <SideNav roomId={params.lobbyId} />
              {/* <ChatArea roomId={params.lobbyId} /> */}
            </div>
          </div>
        </div>
      </LobbyStateProvider>
    </>
  );
};

export default page;
