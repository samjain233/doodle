"use client";
import React, { useEffect } from "react";
import UsersInLobby from "./components/UsersInLobby";
import { LobbyStateProvider } from "./States/lobbyStateManager";
import SideNav from "@/app/main/[game]/components/SideNav";
import toast from "react-hot-toast";

const Lobby = ({ params }) => {
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <>
      <LobbyStateProvider>
        <div className="h-screen w-screen">
          <div className="w-full h-full grid grid-cols-12">
            <div className="col-span-9 bg-white overflow-y-auto">
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

export default Lobby;
