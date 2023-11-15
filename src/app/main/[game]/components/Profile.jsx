import React from "react";
import img from "./user.png";
import Image from "next/image";

const Profile = (props) => {
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

          {props.isAdmin && (
            <div className="h-[1.5em] w-[1.5em] text-xs bg-yellow-600 flex justify-center items-center rounded-full absolute bottom-[35%] right-[25%]">
              A
            </div>
          )}

          <div className="text-black mt-2">UserName</div>
          <div className="text-black font-semibold mt-1">{props.score}</div>
        </div>
      </div>
    </>
  );
};

export default Profile;
