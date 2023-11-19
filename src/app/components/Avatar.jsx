import React, { useEffect, useState, useContext } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import globalStateContext from "../States/GlobalStateManager";

const Avatar = (props) => {
  const { userName } = useContext(globalStateContext);
  const [dataUri, setDataUri] = useState("");

  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: userName,
    });
    avatar.toDataUri().then((data) => {
      setDataUri(data);
    });
  }, [userName]);

  return (
    <>
      <div className="h-[20%] w-[20%] p-2 border-2 border-black rounded-full my-4">
        <img src={dataUri} className="bg-cover rounded-full" />
      </div>
    </>
  );
};

export default Avatar;
