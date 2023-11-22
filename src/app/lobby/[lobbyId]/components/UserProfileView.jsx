import { useContext, useEffect, useState } from "react";
import React from "react";
import globalStateContext from "@/app/States/GlobalStateManager";
import { socket } from "@/app/test/socketConn";
import { GiUpgrade } from "react-icons/gi";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const UserProfileView = (props) => {
  const [dataUri, setDataUri] = useState("");
  const { isAdmin } = useContext(globalStateContext);
  const handleRemoveClick = () => {
    if (isAdmin === false) return;
    const removeUserData = {
      roomId: props.roomId,
      removedUserSocketId: props.socketId,
    };
    socket.emit("removeUser", removeUserData);
  };

  const handleChangeAdminClick = () => {
    if (isAdmin === false) return;
    const newAdminUserData = {
      roomId: props.roomId,
      newAdminSocketId: props.socketId,
    };
    socket.emit("changeAdmin", newAdminUserData);
  };

  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: props.userName,
    });
    avatar.toDataUri().then((data) => {
      setDataUri(data);
    });
  }, []);

  return (
    <>
      <div className="h-full w-full p-4">
        <div className="relative flex flex-col items-center justify-center">
          <img
            src={dataUri}
            height={100}
            width={100}
            alt="User Profile Image"
            className="rounded-full object-cover w-[70%] border border-1 border-solid border-black shadow-xl"
          />

          {!props.result && (
            <div className="h-[2em] w-[2em] bg-green-600 flex justify-center items-center rounded-full absolute top-[5%] right-[15%]">
              1
            </div>
          )}
          {!props.result && !props.isAdmin && isAdmin && (
            <div
              className="h-[1.5em] w-[1.5em] text-xs bg-green-600 flex justify-center items-center rounded-full absolute bottom-[35%] right-[15%] cursor-pointer hover:shadow-md hover:h-[1.75em] hover:w-[1.75em] transition-all"
              onClick={handleChangeAdminClick}
            >
              <GiUpgrade />
            </div>
          )}
          {!props.result && !props.isAdmin && isAdmin && (
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
          {props.result && (
            <div className="h-[3.5em] w-[3.5em] text-xs bg-rose-600 flex justify-center items-center rounded-full absolute top-[5%] left-[15%]">
              {props.index + 1}
            </div>
          )}
          <div className="text-black my-2">{props.userName}</div>
        </div>
      </div>
    </>
  );
};

export default UserProfileView;
