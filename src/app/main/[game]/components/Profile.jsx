import React, { useEffect, useState } from "react";
import { socket } from "@/app/test/socketConn";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const Profile = (props) => {
  const socketId = socket.id;
  const [dataUri, setDataUri] = useState("");
  useEffect(()=>{
    const avatar = createAvatar(avataaars, {
      seed: props.userName,
    });
    avatar.toDataUri().then((data) => {
      setDataUri(data);
    });
  },[])
  

  return (
    <>
      <div className={`h-full w-full p-4 `}>
        <div
          className={`relative p-2 rounded-md flex flex-col items-center justify-center ${
            props.socketId === socketId ? "bg-gray-200" : ""
          }`}
        >
          <img
            src={dataUri}
            height={100}
            width={100}
            alt="User Profile Image"
            className="rounded-full object-cover w-[70%] border border-1 border-solid border-black shadow-xl"
          />

          {props.isAdmin && (
            <div className="h-[1.5em] w-[1.5em] text-xs bg-yellow-600 flex justify-center items-center rounded-full absolute bottom-[50%] right-[25%]">
              A
            </div>
          )}

          <div className="text-black text-xl mt-2">{props.userName}</div>
          <div className="text-black text-xl font-semibold mt-1">
            {props.score}
          </div>
          <div className="text-black text-sm font-semibold mt-1">
            (+ {props.thisRoundScore ? props.thisRoundScore : 0})
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
