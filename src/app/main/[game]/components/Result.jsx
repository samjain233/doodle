import globalStateContext from "@/app/States/GlobalStateManager";
import React, { useContext } from "react";
import UserProfileView from "@/app/lobby/[lobbyId]/components/UserProfileView";

const Result = (roomId) => {
  const { lobby } = useContext(globalStateContext);
  return (
    <>
      <div className="h-full w-full bg-gray-200/20 backdrop-blur-md grid grid-cols-5 gap-4 gap-y-12 relative">
        {lobby.map((element, index) => {
          return (
            <div key={element.socketId}>
              <UserProfileView
                {...element}
                roomId={roomId}
                index={index}
                result={true}
              />
            </div>
          );
        })}
        <a href="/">
          <div className="z-[200] absolute bottom-0 right-0 px-8 py-4 bg-rose-600 text-white text-2xl m-4 rounded-full hover:px-12 transition-all cursor-pointer">
            Return to Home
          </div>
        </a>
      </div>
    </>
  );
};

export default Result;
