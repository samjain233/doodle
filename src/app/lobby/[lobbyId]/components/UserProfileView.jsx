import { useContext } from "react";
import Image from "next/image";
import React from "react";
import img from "./user.png";
import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";

const UserProfileView = (props) => {
  const { isAdmin } = useContext(globalStateContext);
  const handleRemoveClick = () => {
    const removeUserData = {
      roomId: props.roomId,
      removedUserSocketId: props.socketId,
    };
    socket.emit("removeUser", removeUserData);
  };

  const handleChangeAdminClick = () => {
    const newAdminUserData = {
      roomId: props.roomId,
      newAdminSocketId: props.socketId,
    };
    socket.emit("changeAdmin", newAdminUserData);
  };

  return (
    <>
      <div className="h-full w-full p-4">
        <div className="relative flex flex-col items-center justify-center">
          <Image
            src={img}
            height={100}
            width={100}
            alt="User Profile Image"
            className="rounded-full object-cover w-[70%] border border-1 border-solid border-black shadow-xl"
          />

          <div className="h-[2em] w-[2em] bg-green-600 flex justify-center items-center rounded-full absolute top-[5%] right-[15%]">
            5
          </div>
          {!props.isAdmin && isAdmin && (
            <div
              className="h-[1.5em] w-[1.5em] text-xs bg-green-600 flex justify-center items-center rounded-full absolute bottom-[35%] right-[15%] cursor-pointer hover:shadow-md hover:h-[1.75em] hover:w-[1.75em] transition-all"
              onClick={handleChangeAdminClick}
            >
              *
            </div>
          )}
          {!props.isAdmin && isAdmin && (
            <div
              className="h-[1.5em] w-[1.5em] text-xs bg-red-600 flex justify-center items-center rounded-full absolute bottom-[25%] right-[25%] cursor-pointer hover:shadow-md hover:h-[1.75em] hover:w-[1.75em] transition-all"
              onClick={handleRemoveClick}
            >
              x
            </div>
          )}
          {props.isAdmin && (
            <div className="h-[1.5em] w-[1.5em] text-xs bg-yellow-600 flex justify-center items-center rounded-full absolute bottom-[25%] right-[25%]">
              A
            </div>
          )}
          <div className="text-black my-2">UserName</div>
        </div>
      </div>
    </>
  );
};

export default UserProfileView;
