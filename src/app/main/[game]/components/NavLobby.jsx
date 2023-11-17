import React, { useContext, useEffect } from "react";
import img from "./user.png";
import Image from "next/image";
import { IoIosRemoveCircle } from "react-icons/io";
import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";
import { FaPencilAlt } from "react-icons/fa";

const NavLobby = () => {
  const { lobby, setLobby, presenterDetails } = useContext(globalStateContext);
  useEffect(() => {
    socket.on("lobby", (lobbyUsers) => {
      setLobby(lobbyUsers);
    });
  }, []);

  useEffect(() => {
    console.log(presenterDetails);
  }, [presenterDetails]);
  const socketId = socket.id;
  return (
    <>
      <div className="w-full h-full overflow-y-auto py-1">
        {lobby.map((user) => {
          return (
            <div
              className={`shadow-sm my-2 rounded bg-gray-200 ${
                user.thisRoundScore &&
                user.thisRoundScore > 0 &&
                user.socketId !== presenterDetails &&
                "bg-[#70e000]"
              } flex flex-row `}
            >
              <div className="p-2">
                <Image
                  src={img}
                  height={100}
                  width={100}
                  alt="User Profile Image"
                  className="rounded-full object-cover w-[80px] border border-black"
                />
              </div>
              <div className="text-gray-600 p-2 flex flex-col justify-center">
                <div className="font-semibold text-xl">
                  username
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
                <IoIosRemoveCircle />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default NavLobby;
