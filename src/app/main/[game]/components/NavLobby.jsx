import React, { useContext, useEffect } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";
import { FaPencilAlt } from "react-icons/fa";
import NavLobbyAvatar from "./NavLobbyAvatar";

const NavLobby = (props) => {
  const { lobby, setLobby, presenterDetails, isAdmin } =
    useContext(globalStateContext);

  const handleRemoveUser = (removedUserId) => {
    if (isAdmin === false) return;
    const removeUserData = {
      roomId: props.roomId,
      removedUserSocketId: removedUserId,
    };
    socket.emit("removeUser", removeUserData);
  };

  // useEffect(() => {
  //   socket.on("lobby", (lobbyUsers) => {
  //     setLobby(lobbyUsers);
  //   });
  // }, []);

  const socketId = socket.id;
  return (
    <>
      <div className="w-full h-full overflow-y-auto py-1">
        {lobby.map((user) => {
          return (
            <div
              key={user.socketId}
              className={`shadow-sm my-2 rounded ${
                user.thisRoundScore !== undefined &&
                user.thisRoundScore !== null &&
                user.thisRoundScore > 0 &&
                user.socketId !== presenterDetails
                  ? "bg-[#bcff78]"
                  : "bg-gray-200"
              } flex flex-row `}
            >
              <div className="p-1">
                <NavLobbyAvatar userName={user.userName} />
              </div>
              <div className="text-gray-600 p-2 flex flex-col justify-center">
                <div className="font-semibold text-xl">
                  {user.userName}
                  {socketId === user.socketId && (
                    <span className="text-sm"> (you)</span>
                  )}
                </div>
                <div>
                  Points : {user.score}
                  {user.thisRoundScore !== undefined &&
                    user.thisRoundScore > 0 && (
                      <span className="font-semibold text-sm">
                        {" "}
                        ( +{user.thisRoundScore})
                      </span>
                    )}
                </div>
              </div>
              <div className="text-3xl text-red-400 flex-grow flex items-center justify-end p-2">
                {user.socketId === presenterDetails && (
                  <div className="text-blue-500 text-xl px-2">
                    <FaPencilAlt />
                  </div>
                )}
                {isAdmin && !user.isAdmin && (
                  <div
                    className="cursor-pointer hover:text-red-500 transition-all"
                    onClick={() => handleRemoveUser(user.socketId)}
                  >
                    <IoIosRemoveCircle />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default NavLobby;
