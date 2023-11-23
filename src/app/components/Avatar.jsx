import React, { useEffect, useState, useContext } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import globalStateContext from "../States/GlobalStateManager";
import { useSession } from "next-auth/react";

const Avatar = () => {
  const { userName } = useContext(globalStateContext);
  const [dataUri, setDataUri] = useState("");
  const [level, setLevel] = useState(1);
  const [showScore, setShowScore] = useState(false);
  const session = useSession();

  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: userName,
    });
    avatar.toDataUri().then((data) => {
      setDataUri(data);
    });
  }, [userName]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      setShowScore(true);
    }
  }, [session]);

  return (
    <>
      <div className="relative h-[20%] w-[20%] p-2 border-2 border-black rounded-full my-4">
        <img src={dataUri} className="bg-cover rounded-full" />
        <div className="h-[25%] w-[25%] text-xl bg-green-600 flex justify-center items-center rounded-full absolute top-[3%] right-[3%]">
          {level}
        </div>
      </div>
      {showScore && (
        <div className="text-xl mt-[-2%] mb-[20px]">Score : 550 pts</div>
      )}
    </>
  );
};

export default Avatar;
