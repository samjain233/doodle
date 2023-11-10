import React, { useEffect, useContext } from "react";
import UserProfileView from "./UserProfileView";
import lobbyStateContext from "../States/lobbyStateManager";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";

const UsersInLobby = ({ roomId }) => {
  const { lobby, setLobby } = useContext(lobbyStateContext);
  const { isAdmin, setAdmin } = useContext(globalStateContext);
  const data = {
    userName: "helloSam",
    roomId: roomId,
  };
  useEffect(() => {
    socket.emit("userJoined", data);
    socket.on("userIsJoined", (userStatus) => {
      //   console.log(userStatus);
      socket.emit("joinLobby", data);
    });

    socket.on("setAdmin", (data) => {
      if (data.setAdmin === true) setAdmin(true);
      else setAdmin(false);
    });

    socket.on("lobby", (lobbyUsers) => {
      setLobby(lobbyUsers);
    });
    socket.on("disconnect", () => {
      console.log(socket.connected);
    });
  }, []);

  return (
    <>
      <div className="h-full w-full bg-white grid grid-cols-4 gap-4 gap-y-12">
        {lobby.map((element) => {
          return (
            <div key={element.socketId}>
              <UserProfileView {...element} roomId={roomId} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UsersInLobby;
