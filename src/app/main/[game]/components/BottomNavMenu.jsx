import React, { useEffect, useContext } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { socket } from "@/app/test/socketConn";
import globalStateContext from "@/app/States/GlobalStateManager";

const BottomNavMenu = ({ roomId }) => {
  const { setGameStarted, isAdmin, gameStarted } =
    useContext(globalStateContext);
  const router = useRouter();
  useEffect(() => {
    socket.on("StartGame", (gameLink) => {
      setGameStarted(true);
      router.push(gameLink);
    });
  }, []);
  const handleStartClick = () => {
    if(isAdmin === false || gameStarted === true) return;
    socket.emit("controlStartGame", roomId);
  };
  return (
    <>
      {isAdmin && !gameStarted && (
        <div
          className="h-full flex items-center text-2xl cursor-pointer"
          onClick={() => handleStartClick()}
        >
          <BsPlayCircleFill />
        </div>
      )}
    </>
  );
};

export default BottomNavMenu;
