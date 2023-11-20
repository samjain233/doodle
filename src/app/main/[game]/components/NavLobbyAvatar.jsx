import React, { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const NavLobbyAvatar = ({ userName }) => {
  const [dataUri, setDataUri] = useState("");
  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: userName,
    });
    avatar.toDataUri().then((data) => {
      setDataUri(data);
    });
  }, []);

  return (
    <>
      <img
        src={dataUri}
        height={100}
        width={100}
        alt="User Profile Image"
        className="rounded-full object-cover w-[80px] border border-black"
      />
    </>
  );
};

export default NavLobbyAvatar;
