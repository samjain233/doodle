import React, { useState } from "react";
import ChatArea from "./ChatArea";
import SideNavNavigation from "./SideNavNavigation";
import Settings from "./Settings";
import BottomNavMenu from "./BottomNavMenu";
import Time from "./Time";
import GuessWord from "./GuessWord";
import NavLobby from "./NavLobby";

const SideNav = ({ roomId }) => {
  const [selectedSideNav, setSelectedSideNav] = useState("chats");
  return (
    <>
      <div className="w-full h-screen bg-gray-300 shadow-md p-1">
        <div className="w-full h-full grid grid-rows-16 grid-flow-col">
          <div className="w-full h-full row-span-2 border-b border-white border-solid">
            <Time />
          </div>
          <div className="w-full h-full row-span-2 border-b border-white border-solid">
            <GuessWord />
          </div>
          <div className="w-full h-full border-b border-white border-solid">
            <SideNavNavigation
              selectedSideNav={selectedSideNav}
              setSelectedSideNav={setSelectedSideNav}
            />
          </div>
          <div className="w-full h-full row-[span_10_/_span_10] border-b border-white border-solid">
            {selectedSideNav === "chats" && <ChatArea roomId={roomId} />}
            {selectedSideNav === "lobby" && <NavLobby />}
            {selectedSideNav === "settings" && <Settings roomId={roomId} />}
          </div>
          <div className="w-full h-full ">
            <BottomNavMenu roomId={roomId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
