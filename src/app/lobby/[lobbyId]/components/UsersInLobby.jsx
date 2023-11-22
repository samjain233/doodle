import React, { useEffect, useContext } from "react";
import UserProfileView from "./UserProfileView";
import lobbyStateContext from "../States/lobbyStateManager";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";
import { useRouter } from "next/navigation";

const UsersInLobby = ({ roomId }) => {
  const router = useRouter();
  const { isAdmin, setAdmin, lobby, setLobby } = useContext(globalStateContext);
  useEffect(() => {
    //checking for socket connection established or not
    if (socket.connected === false) {
      socket.disconnect();
      socket.removeAllListeners();
      //sending user to home page
      router.push("/");
    }
  }, []);

  return (
    <>
      <div className="h-full w-full bg-white grid grid-cols-4 gap-4 gap-y-12">
        {lobby.map((element) => {
          return (
            <div key={element.socketId}>
              <UserProfileView {...element} roomId={roomId} result={false} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UsersInLobby;
